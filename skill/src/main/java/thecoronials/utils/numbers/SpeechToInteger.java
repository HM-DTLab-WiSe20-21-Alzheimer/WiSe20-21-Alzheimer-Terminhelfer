package thecoronials.utils.numbers;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

/**
 * Utility class to replace numbers in text form with their integer counterpart.
 */
public class SpeechToInteger {

    /**
     * Prevents instantiation.
     */
    private SpeechToInteger() {
    }

    /**
     * Result set from matching.
     */
    private static class Result {
        /**
         * Current number.
         */
        private final int number;

        /**
         * Current input.
         */
        private final String input;

        /**
         * Create result from matching.
         *
         * @param number Current number.
         * @param input  Current input.
         */
        Result(int number, String input) {
            this.number = number;
            this.input = input;
        }

        /**
         * Get current number.
         *
         * @return Current number
         */
        public int getNumber() {
            return number;
        }

        /**
         * Get current input.
         *
         * @return Current input.
         */
        public String getInput() {
            return input;
        }
    }

    /**
     * Number mapping.
     */
    private static final Map<String, Integer> numbers = generateNumbers();

    /**
     * Special number mapping.
     */
    private static final Map<String, Integer> numbersSpecial = generateNumbersSpecial();

    /**
     * Generate number mapping.
     *
     * @return Number mapping
     */
    private static Map<String, Integer> generateNumbers() {
        final Map<String, Integer> numbers = new HashMap<>();
        numbers.put("eins", 1);
        numbers.put("zwei", 2);
        numbers.put("zwan", 2);
        numbers.put("drei", 3);
        numbers.put("vier", 4);
        numbers.put("fuenf", 5);
        numbers.put("sechs", 6);
        numbers.put("sieben", 7);
        numbers.put("sieb", 7);
        numbers.put("acht", 8);
        numbers.put("neun", 9);

        return numbers;
    }

    /**
     * Generate special number mapping.
     *
     * @return Special number mapping.
     */
    private static Map<String, Integer> generateNumbersSpecial() {
        final Map<String, Integer> numbersSpecial = new HashMap<>();
        numbersSpecial.put("zehn", 10);
        numbersSpecial.put("elf", 11);
        numbersSpecial.put("zwoelf", 12);

        return numbersSpecial;
    }

    /**
     * Match hundreds in result.
     *
     * @param previous Previous result.
     * @return Result with matched hundreds.
     */
    private static Result matchHundreds(Result previous) {
        int number = previous.getNumber();
        String textualNumberClean = previous.getInput();

        final Pattern hundredsPattern = Pattern.compile("(\\S*)hundert(\\S*)");
        final Matcher hundredsMatcher = hundredsPattern.matcher(textualNumberClean);

        if (hundredsMatcher.matches()) {
            final String hundreds = hundredsMatcher.group(1);

            if (hundreds.equals("")) {
                number += 100;
            }

            if (numbers.containsKey(hundreds)) {
                number += numbers.get(hundreds) * 100;
            }

            textualNumberClean = textualNumberClean.replaceAll(hundreds + "hundert", "");
        }

        return new Result(number, textualNumberClean);
    }

    /**
     * Match ones in result.
     *
     * @param previous Previous result.
     * @return Result with matched ones.
     */
    private static Result matchOnes(Result previous) {
        int number = previous.getNumber();
        String textualNumberClean = previous.getInput();

        final Pattern onesPattern = Pattern.compile("((\\S*)(und|zehn))?(\\S*)");
        final Matcher onesMatcher = onesPattern.matcher(textualNumberClean);

        if (onesMatcher.matches()) {
            final String onesInTens = onesMatcher.group(2);
            final String middlePart = onesMatcher.group(3);
            final String onesOrRest = onesMatcher.group(4);

            final String ones = onesInTens == null ? onesOrRest : onesInTens;
            textualNumberClean = onesOrRest;
            if (onesInTens == null && numbers.containsKey(ones)) {
                textualNumberClean = "";
            }

            if (middlePart != null && ones.equals("") && middlePart.equals("zehn")) {
                textualNumberClean = middlePart;
            }

            if (numbers.containsKey(ones)) {
                number += numbers.get(ones);

                if (middlePart != null && middlePart.equals("zehn")) {
                    textualNumberClean = middlePart;
                }
            }
        }

        return new Result(number, textualNumberClean);
    }

    /**
     * Match tens in result.
     *
     * @param previous Previous result.
     * @return Result with matched tens.
     */
    private static Result matchTens(Result previous) {
        int number = previous.getNumber();
        String textualNumberClean = previous.getInput();

        final Pattern tensPattern = Pattern.compile("(\\S*)zig");
        final Matcher tensMatcher = tensPattern.matcher(textualNumberClean);

        if (numbersSpecial.containsKey(textualNumberClean)) {
            number += numbersSpecial.get(textualNumberClean);
        }

        if (tensMatcher.matches()) {
            final String tens = tensMatcher.group(1);

            if (numbers.containsKey(tens)) {
                number += numbers.get(tens) * 10;
            }
        }

        return new Result(number, textualNumberClean);
    }

    /**
     * Converts text into number. Optional if non-number given.
     *
     * @param textualNumber Number in german text form. Greater than 0.
     * @return Number in integer form.
     */
    public static Optional<Integer> convert(String textualNumber) {

        final int number = matchTens(matchOnes(matchHundreds(
                new Result(0, textualNumber.toLowerCase().trim())
        ))).getNumber();

        return number == 0 ? Optional.empty() : Optional.of(number);
    }

    /**
     * Replaces all numbers in text form with their integer counterpart.
     *
     * @param sentence Sentence to replace numbers in.
     * @return Sentence with replaced numbers.
     */
    public static String convertSentence(String sentence) {
        return Arrays.stream(sentence.split(" "))
                .map(word -> convert(word).map(Object::toString).orElse(word))
                .collect(Collectors.joining(" "));
    }
}
