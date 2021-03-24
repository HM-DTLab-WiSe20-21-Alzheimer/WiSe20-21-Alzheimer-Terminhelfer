package thecoronials.repositories.link;

import com.amazonaws.services.dynamodbv2.document.DynamoDB;
import com.amazonaws.services.dynamodbv2.document.Table;
import com.amazonaws.services.dynamodbv2.model.*;

import java.util.List;
import java.util.stream.StreamSupport;

public class LinkTable {
    public static final String TABLE = "TerminHelferCompanionLinkIntent";
    public static final String FIELD_LINK_ID = "linkid";
    public static final String FIELD_ALEXA_UID = "alexauid";
    public static final String INDEX_ALEXA_UID = "AlexaUIdIndex";

    private final DynamoDB dynamoDB;


    LinkTable(DynamoDB dynamoDB) {
        this.dynamoDB = dynamoDB;
    }

    /**
     * Checks whether table exists or not.
     *
     * @return True if table exists.
     */
    boolean doesExist() {
        return StreamSupport.stream(dynamoDB.listTables().spliterator(), false)
                .anyMatch(table -> table.getTableName().equals(TABLE));
    }

    /**
     * Create companion link table.
     *
     * @return Companion link table.
     */
    Table create() {
        final List<AttributeDefinition> attributeDefinitions = List.of(
                new AttributeDefinition().withAttributeName(FIELD_LINK_ID).withAttributeType(ScalarAttributeType.S),
                new AttributeDefinition().withAttributeName(FIELD_ALEXA_UID).withAttributeType(ScalarAttributeType.S)
        );

        final List<KeySchemaElement> keySchema = List.of(
                new KeySchemaElement().withAttributeName(FIELD_LINK_ID).withKeyType(KeyType.HASH),
                new KeySchemaElement().withAttributeName(FIELD_ALEXA_UID).withKeyType(KeyType.RANGE)
        );

        final KeySchemaElement alexaUIdIndexSchema = new KeySchemaElement()
                .withAttributeName(FIELD_ALEXA_UID)
                .withKeyType(KeyType.HASH);

        final GlobalSecondaryIndex alexaUIdIndex = new GlobalSecondaryIndex()
                .withKeySchema(alexaUIdIndexSchema)
                .withIndexName(INDEX_ALEXA_UID)
                .withProvisionedThroughput(new ProvisionedThroughput(20L, 10L))
                .withProjection(new Projection().withProjectionType(ProjectionType.ALL));

        final CreateTableRequest request = new CreateTableRequest()
                .withTableName(TABLE)
                .withAttributeDefinitions(attributeDefinitions)
                .withKeySchema(keySchema)
                .withGlobalSecondaryIndexes(alexaUIdIndex)
                // Maximum of 20 reads per second and 10 writes per second
                .withProvisionedThroughput(new ProvisionedThroughput(20L, 10L));

        return dynamoDB.createTable(request);
    }

    /**
     * Get companion link table.
     *
     * @return Companion link table.
     */
    Table get() {
        return dynamoDB.getTable(TABLE);
    }
}
