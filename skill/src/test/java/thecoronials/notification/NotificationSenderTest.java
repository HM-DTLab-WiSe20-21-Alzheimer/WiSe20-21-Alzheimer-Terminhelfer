package thecoronials.notification;

import com.amazonaws.services.stepfunctions.AWSStepFunctions;
import com.amazonaws.services.stepfunctions.model.StartExecutionRequest;
import org.junit.Before;
import org.junit.Test;
import org.mockito.ArgumentCaptor;
import thecoronials.utils.config.Config;

import java.util.Map;

import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.*;

public class NotificationSenderTest {

    Config config;
    AWSStepFunctions stepFunctions;

    @Before
    public void createConfig() {
        config = Config.with(Map.of(Config.PROACTIVE_STATE_ARN, "arn"));
        stepFunctions = mock(AWSStepFunctions.class);
    }

    @Test
    public void sendNotification() {
        // arrange
        ArgumentCaptor<StartExecutionRequest> requestArgumentCaptor = ArgumentCaptor.forClass(StartExecutionRequest.class);
        when(stepFunctions.startExecution(requestArgumentCaptor.capture())).thenReturn(null);

        final NotificationSender notificationSender = new NotificationSender(stepFunctions, config);
        final String user = "foo";
        final String content = "bar";
        final String time = "baz";

        final String inputWant = "{" +
                "\"time\": \"" + time + "\"," +
                "\"user\": \"" + user + "\"," +
                "\"content\": \"" + content + "\"" +
                "}";

        // act
        notificationSender.send(user, content, time);
        final StartExecutionRequest request = requestArgumentCaptor.getValue();

        // assert
        verify(stepFunctions, times(1)).startExecution(any());
        assertEquals(inputWant, request.getInput());
        assertEquals("arn", request.getStateMachineArn());
    }


}
