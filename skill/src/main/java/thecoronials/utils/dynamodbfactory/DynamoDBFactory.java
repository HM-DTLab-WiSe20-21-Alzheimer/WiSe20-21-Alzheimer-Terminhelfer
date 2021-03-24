package thecoronials.utils.dynamodbfactory;

import com.amazonaws.services.dynamodbv2.document.DynamoDB;

public interface DynamoDBFactory {
    DynamoDB build();
}
