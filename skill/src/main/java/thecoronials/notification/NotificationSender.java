package thecoronials.notification;

import com.amazonaws.services.stepfunctions.AWSStepFunctions;
import com.amazonaws.services.stepfunctions.model.StartExecutionRequest;
import thecoronials.utils.config.Config;

/**
 * Sender for push notifications.
 */
public class NotificationSender {

    /**
     * StepFunctions client.
     */
    private final AWSStepFunctions client;

    /**
     * App config.
     */
    private final Config config;

    /**
     * Create sender.
     *
     * @param client StepFunctions client.
     * @param config App config with state machine arn.
     */
    public NotificationSender(
            AWSStepFunctions client,
            Config config
    ) {
        this.client = client;
        this.config = config;
    }

    /**
     * Queue notification for something.
     *
     * @param userId    User the notification is for.
     * @param content   Content of the notification.
     * @param timestamp Timestamp of the time the notification should trigger.
     */
    public void send(String userId, String content, String timestamp) {
        StartExecutionRequest startExecutionRequest = new StartExecutionRequest()
                .withName("" + System.currentTimeMillis())
                .withInput("{" +
                        "\"time\": \"" + timestamp + "\"," +
                        "\"user\": \"" + userId + "\"," +
                        "\"content\": \"" + content + "\"" +
                        "}"
                )
                .withStateMachineArn(config.getProperty(Config.PROACTIVE_STATE_ARN));

        client.startExecution(startExecutionRequest);
    }
}
