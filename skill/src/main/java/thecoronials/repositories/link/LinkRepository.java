package thecoronials.repositories.link;

import com.amazonaws.services.dynamodbv2.document.DynamoDB;
import com.amazonaws.services.dynamodbv2.document.Index;
import com.amazonaws.services.dynamodbv2.document.Item;
import com.amazonaws.services.dynamodbv2.document.Table;
import com.amazonaws.services.dynamodbv2.document.spec.QuerySpec;
import com.amazonaws.services.dynamodbv2.document.utils.ValueMap;
import thecoronials.utils.LinkIdGenerator;

import java.util.stream.StreamSupport;

public class LinkRepository {
    private final Table table;

    public LinkRepository(DynamoDB dynamoDB) throws InterruptedException {
        final LinkTable linkTable = new LinkTable(dynamoDB);
        table = linkTable.doesExist() ? linkTable.get() : linkTable.create();
        table.waitForActive();
    }

    /**
     * Get link id and if none exists create it.
     *
     * @param forUId User to search link code for.
     * @return Link id for given user.
     */
    public String getOrCreate(String forUId) {
        return getOrCreate(forUId, new LinkIdGenerator());
    }

    /**
     * Get link id and if none exists create it.
     *
     * @param forUId          User to search link code for.
     * @param linkIdGenerator Generator to use for code generation.
     * @return Link id for given user.
     */
    public String getOrCreate(String forUId, LinkIdGenerator linkIdGenerator) {
        final QuerySpec querySpec = new QuerySpec()
                .withKeyConditionExpression(LinkTable.FIELD_ALEXA_UID + " = :a_u_id")
                .withValueMap(new ValueMap().withString(":a_u_id", forUId));

        final Index index = table.getIndex(LinkTable.INDEX_ALEXA_UID);

        return StreamSupport.stream(index.query(querySpec).spliterator(), false)
                .findAny()
                .map(item -> item.getString(LinkTable.FIELD_LINK_ID))
                .orElseGet(() -> {
                    // Create new link and fetch it
                    table.putItem(
                            new Item()
                                    .withString(LinkTable.FIELD_LINK_ID, linkIdGenerator.create())
                                    .withString(LinkTable.FIELD_ALEXA_UID, forUId)
                    );

                    return getOrCreate(forUId);
                });
    }
}
