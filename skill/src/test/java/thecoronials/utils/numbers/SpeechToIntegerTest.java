package thecoronials.utils.numbers;

import org.junit.Test;
import org.junit.experimental.runners.Enclosed;
import org.junit.runner.RunWith;
import org.junit.runners.Parameterized;

import java.util.Arrays;
import java.util.Collection;
import java.util.Optional;

import static org.junit.Assert.assertEquals;

@RunWith(Enclosed.class)
public class SpeechToIntegerTest {

    @RunWith(Parameterized.class)
    public static class WordToIntegerTest {

        @Parameterized.Parameters
        public static Collection<Object[]> data() {
            return Arrays.asList(new Object[][]{
                    {"eins", 1},
                    {"zehn", 10},
                    {"elf", 11},
                    {"zwoelf", 12},
                    {"vierzehn", 14},
                    {"zweiundvierzig", 42},
                    {"vierundachtzig", 84},
                    {"NEUN", 9},
                    {"fuenfzehn", 15},
                    {"fuenFzehn", 15},
                    {"hundert", 100},
                    {"hundertzwoelf", 112},
                    {"vierhundertacht", 408},
                    {"neunhundertneunundneunzig", 999},
                    // Nonsense
                    {"haus", null},
                    {"", null},
                    {"zwaizehn", null},
                    {"zwaihundert", null},
            });
        }

        private final String text;
        private final Integer result;

        public WordToIntegerTest(String text, Integer result) {
            this.text = text;
            this.result = result;
        }

        @Test
        public void generateInteger() {
            final Optional<Integer> have = SpeechToInteger.convert(text);

            assertEquals(result, have.orElse(null));
        }
    }

    @RunWith(Parameterized.class)
    public static class SentenceToIntegerTest {

        @Parameterized.Parameters
        public static Collection<Object[]> data() {
            return Arrays.asList(new Object[][]{
                    {"Das ist eine siebzehn", "Das ist eine 17"},
                    {"Siebzehn ist eine schoene zahl", "17 ist eine schoene zahl"},
                    {"ZweiundVierzig ist der Sinn", "42 ist der Sinn"},
                    {"Keine Zahl", "Keine Zahl"},
            });
        }

        private final String text;
        private final String result;


        public SentenceToIntegerTest(String text, String result) {
            this.text = text;
            this.result = result;
        }

        @Test
        public void generateIntegerFromSentence() {
            final String have = SpeechToInteger.convertSentence(text);

            assertEquals(result, have);
        }

    }

}
