package thecoronials.repositories.link;

import com.amazonaws.services.dynamodbv2.document.*;
import com.amazonaws.services.dynamodbv2.document.spec.QuerySpec;
import com.amazonaws.services.dynamodbv2.model.CreateTableRequest;
import com.amazonaws.services.dynamodbv2.model.ListTablesResult;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.Timeout;
import thecoronials.utils.LinkIdGenerator;

import javax.management.Query;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.*;

public class LinkRepositoryTest {
    @Rule
    public Timeout globalTimeout = Timeout.seconds(2);

    private Table tableMock;
    private Index indexMock;
    private Random seededGenerator;

    @Before
    public void generateTable() {
        tableMock = mock(Table.class);
        when(tableMock.getTableName()).thenReturn(LinkTable.TABLE);

        final List<Item> contents = new ArrayList<>();

        final ItemCollection<QueryOutcome> itemCollection = mock(ItemCollection.class);
        when(itemCollection.spliterator()).thenAnswer(__ -> contents.spliterator());

        indexMock = mock(Index.class);
        when(indexMock.query(any(QuerySpec.class))).thenReturn(itemCollection);

        when(tableMock.putItem(any(Item.class))).thenAnswer(invocation -> {
            contents.add(invocation.getArgument(0));

            return mock(PutItemOutcome.class);
        });

        when(tableMock.getIndex(LinkTable.INDEX_ALEXA_UID)).thenReturn(indexMock);
    }

    @Before
    public void init() {
        seededGenerator = new Random(15122020);
    }

    private DynamoDB getDynamoMock(boolean withTable) {
        final List<Table> tables = withTable ? List.of(tableMock) : List.of();

        final TableCollection<ListTablesResult> tableCollection = mock(TableCollection.class);
        when(tableCollection.spliterator()).thenReturn(tables.spliterator());

        final DynamoDB dynamoDB = mock(DynamoDB.class);
        when(dynamoDB.listTables()).thenReturn(tableCollection);
        when(dynamoDB.getTable(LinkTable.TABLE)).thenReturn(tableMock);
        when(dynamoDB.createTable(any(CreateTableRequest.class))).thenReturn(tableMock);


        return dynamoDB;
    }

    @Test
    public void createWithExistingTable() throws InterruptedException {
        // arrange
        final DynamoDB dynamoDB = getDynamoMock(true);

        // act
        new LinkRepository(dynamoDB);

        // assert
        verify(dynamoDB, times(1)).getTable(LinkTable.TABLE);
        verify(dynamoDB, never()).createTable(any(CreateTableRequest.class));
        verify(tableMock, times(1)).waitForActive();
    }

    @Test
    public void createWithoutExistingTable() throws InterruptedException {
        // arrange
        final DynamoDB dynamoDB = getDynamoMock(false);

        // act
        new LinkRepository(dynamoDB);

        // assert
        verify(dynamoDB, never()).getTable(LinkTable.TABLE);
        verify(dynamoDB, times(1)).createTable(any(CreateTableRequest.class));
        verify(tableMock, times(1)).waitForActive();
    }

    @Test
    public void getNotExistingRandom() throws InterruptedException {
        // arrange
        final DynamoDB dynamoDB = getDynamoMock(true);

        // act
        final LinkRepository linkRepository = new LinkRepository(dynamoDB);
        linkRepository.getOrCreate("abc");


        // assert
        verify(indexMock, times(2)).query(any(QuerySpec.class));
        verify(tableMock, times(1)).putItem(any(Item.class));
    }

    @Test
    public void getNotExistingRandomSeeded() throws InterruptedException {
        // arrange
        final DynamoDB dynamoDB = getDynamoMock(true);

        // act
        final LinkRepository linkRepository = new LinkRepository(dynamoDB);
        final String result = linkRepository.getOrCreate("abc", new LinkIdGenerator(seededGenerator));

        // assert
        verify(indexMock, times(2)).query(any(QuerySpec.class));
        verify(tableMock, times(1)).putItem(any(Item.class));
        assertEquals("LLK26SM", result);
    }

    @Test
    public void getExistingRandom() throws InterruptedException {
        // arrange
        final DynamoDB dynamoDB = getDynamoMock(true);

        // act
        final LinkRepository linkRepository = new LinkRepository(dynamoDB);
        final String resultOriginal = linkRepository.getOrCreate("abc");
        final String result = linkRepository.getOrCreate("abc");

        // assert
        verify(indexMock, times(3)).query(any(QuerySpec.class));
        verify(tableMock, times(1)).putItem(any(Item.class));
        assertEquals(resultOriginal, result);
    }

    @Test
    public void getExistingSeeded() throws InterruptedException {
        // arrange
        final DynamoDB dynamoDB = getDynamoMock(true);

        // act
        final LinkRepository linkRepository = new LinkRepository(dynamoDB);
        final String resultOriginal = linkRepository.getOrCreate("abc", new LinkIdGenerator(seededGenerator));
        final String result = linkRepository.getOrCreate("abc", new LinkIdGenerator(seededGenerator));

        // assert
        verify(indexMock, times(3)).query(any(QuerySpec.class));
        verify(tableMock, times(1)).putItem(any(Item.class));
        assertEquals("LLK26SM", resultOriginal);
        assertEquals("LLK26SM", result);
        assertEquals(resultOriginal, result);
    }
}
