package thecoronials.repositories.link;

import com.amazonaws.services.dynamodbv2.document.DynamoDB;
import com.amazonaws.services.dynamodbv2.document.Table;
import com.amazonaws.services.dynamodbv2.document.TableCollection;
import com.amazonaws.services.dynamodbv2.model.*;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.Timeout;
import org.mockito.ArgumentCaptor;

import java.util.List;

import static org.junit.Assert.*;
import static org.mockito.Mockito.*;

public class LinkTableTest {
    @Rule
    public Timeout globalTimeout = Timeout.seconds(20);

    private TableCollection<ListTablesResult> getTableCollectionMock(List<Table> tables) {
        final TableCollection<ListTablesResult> tableCollection = mock(TableCollection.class);
        when(tableCollection.spliterator()).thenReturn(tables.spliterator());

        return tableCollection;
    }

    private Table getTableMock(String name) {
        final Table table = mock(Table.class);
        when(table.getTableName()).thenReturn(name);

        return table;
    }

    @Test
    public void doesExist() {
        // arrange
        final Table table = getTableMock(LinkTable.TABLE);
        final TableCollection<ListTablesResult> tableCollection = getTableCollectionMock(
                List.of(
                        table,
                        getTableMock("another")
                )
        );

        // Mock dynamo client
        final DynamoDB dynamoDB = mock(DynamoDB.class);
        when(dynamoDB.listTables()).thenReturn(tableCollection);

        final LinkTable linkTable = new LinkTable(dynamoDB);

        // act
        final boolean have = linkTable.doesExist();

        // assert
        assertTrue(have);
        verify(table, times(1)).getTableName();
        verify(tableCollection, times(1)).spliterator();
        verify(dynamoDB, times(1)).listTables();
    }

    @Test
    public void doesNotExist() {
        // arrange
        final TableCollection<ListTablesResult> tableCollection = getTableCollectionMock(
                List.of(getTableMock("another"))
        );

        // Mock dynamo client
        final DynamoDB dynamoDB = mock(DynamoDB.class);
        when(dynamoDB.listTables()).thenReturn(tableCollection);

        final LinkTable linkTable = new LinkTable(dynamoDB);

        // act
        final boolean have = linkTable.doesExist();

        // assert
        assertFalse(have);
        verify(tableCollection, times(1)).spliterator();
        verify(dynamoDB, times(1)).listTables();
    }

    private boolean hasCreateTableRequestAttribute(CreateTableRequest request, String field, ScalarAttributeType type) {
        return request
                .getAttributeDefinitions()
                .stream()
                .filter(attribute -> attribute.getAttributeName().equals(field))
                .anyMatch(attribute -> attribute.getAttributeType().equals(type.toString()));
    }

    private boolean hasCreateTableRequestKey(CreateTableRequest request, String keyName, KeyType keyType) {
        return request
                .getKeySchema()
                .stream()
                .filter(key -> key.getAttributeName().equals(keyName))
                .anyMatch(key -> key.getKeyType().equals(keyType.toString()));
    }

    @Test
    public void createTable() {
        // arrange
        final DynamoDB dynamoDB = mock(DynamoDB.class);
        final ArgumentCaptor<CreateTableRequest> createTableRequestArgumentCaptor = ArgumentCaptor.forClass(CreateTableRequest.class);
        final LinkTable linkTable = new LinkTable(dynamoDB);

        // act
        linkTable.create();

        verify(dynamoDB).createTable(createTableRequestArgumentCaptor.capture());
        final CreateTableRequest createTableRequest = createTableRequestArgumentCaptor.getValue();

        final boolean containsLinkIdAttribute = hasCreateTableRequestAttribute(
                createTableRequest,
                LinkTable.FIELD_LINK_ID,
                ScalarAttributeType.S
        );

        final boolean containsAlexaUIdAttribute = hasCreateTableRequestAttribute(
                createTableRequest,
                LinkTable.FIELD_ALEXA_UID,
                ScalarAttributeType.S
        );

        final boolean containsLinkIdKey = hasCreateTableRequestKey(
                createTableRequest,
                LinkTable.FIELD_LINK_ID,
                KeyType.HASH
        );

        final boolean containsAlexaUIdKey = hasCreateTableRequestKey(
                createTableRequest,
                LinkTable.FIELD_ALEXA_UID,
                KeyType.RANGE
        );

        final List<GlobalSecondaryIndex> secondaryIndex = createTableRequest.getGlobalSecondaryIndexes();
        final boolean containsAlexaUIdGlobalSecondaryIndex = secondaryIndex
                .stream()
                .filter(index -> index.getIndexName().equals(LinkTable.INDEX_ALEXA_UID))
                .filter(index -> index
                        .getKeySchema()
                        .stream()
                        .filter(key -> key.getAttributeName().equals(LinkTable.FIELD_ALEXA_UID))
                        .anyMatch(key -> key.getKeyType().equals(KeyType.HASH.toString()))
                )
                .filter(index -> index.getProvisionedThroughput().getReadCapacityUnits() == 20L)
                .filter(index -> index.getProvisionedThroughput().getWriteCapacityUnits() == 10L)
                .anyMatch(index -> index.getProjection().getProjectionType().equals(ProjectionType.ALL.toString()));
        // assert
        assertEquals(LinkTable.TABLE, createTableRequest.getTableName());
        assertEquals(2, createTableRequest.getAttributeDefinitions().size());
        assertEquals(20L, createTableRequest.getProvisionedThroughput().getReadCapacityUnits().longValue());
        assertEquals(10L, createTableRequest.getProvisionedThroughput().getWriteCapacityUnits().longValue());
        assertTrue(containsLinkIdAttribute);
        assertTrue(containsAlexaUIdAttribute);
        assertTrue(containsLinkIdKey);
        assertTrue(containsAlexaUIdKey);
        assertEquals(1, secondaryIndex.size());
        assertTrue(containsAlexaUIdGlobalSecondaryIndex);
    }

    @Test
    public void get() {
        // arrange
        final Table tableMock = getTableMock(LinkTable.TABLE);
        final DynamoDB dynamoDB = mock(DynamoDB.class);
        when(dynamoDB.getTable(LinkTable.TABLE)).thenReturn(tableMock);
        final LinkTable linkTable = new LinkTable(dynamoDB);

        // act
        final Table table = linkTable.get();

        // assert
        assertEquals(tableMock, table);
        verify(dynamoDB, times(1)).getTable(LinkTable.TABLE);
    }
}
