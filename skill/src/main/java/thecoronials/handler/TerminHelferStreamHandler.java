package thecoronials.handler;

import com.amazon.ask.Skill;
import com.amazon.ask.SkillStreamHandler;
import com.amazon.ask.Skills;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder;
import com.amazonaws.services.dynamodbv2.document.DynamoDB;
import thecoronials.handler.companion.CompanionAppIntentHandler;
import thecoronials.handler.companion.CompanionLinkIntentHandler;
import thecoronials.handler.defaults.CancelAndStopIntentHandler;
import thecoronials.handler.defaults.HelpIntentHandler;
import thecoronials.handler.defaults.LaunchRequestHandler;
import thecoronials.handler.defaults.SessionEndedRequestHandler;

public class TerminHelferStreamHandler extends SkillStreamHandler {
    private static Skill getSkill() {
        return Skills.standard()
                .addRequestHandlers(
                        new CancelAndStopIntentHandler(),
                        new CompanionAppIntentHandler(),
                        new CompanionLinkIntentHandler(() -> new DynamoDB(AmazonDynamoDBClientBuilder.standard().build())),
                        new HelpIntentHandler(),
                        new LaunchRequestHandler(),
                        new SessionEndedRequestHandler(),
                        new TerminAusgabeHandler(),
                        new TerminEintragenHandler(),
                        new DailyOverviewHandler(),
                        new OrtEintragenHandler(),
                        new AddTransportHandler(),
                        new SaveAppointmentHandler(),
                        new UseDefaultTransportHandler(),
                        new OrtBearbeitenHandler()
                )
                .withTableName("TerminHelfer")
                .withAutoCreateTable(true)
                .build();
    }

    public TerminHelferStreamHandler() {
        super(getSkill());
    }
}
