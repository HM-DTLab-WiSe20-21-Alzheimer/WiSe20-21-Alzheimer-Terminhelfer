package thecoronials.utils;

import com.aventrix.jnanoid.jnanoid.NanoIdUtils;

import java.util.Random;

public class LinkIdGenerator {

    final Random random;

    public LinkIdGenerator() {
        this(NanoIdUtils.DEFAULT_NUMBER_GENERATOR);
    }

    public LinkIdGenerator(Random random) {
        this.random = random;
    }

    public String create() {
        final char[] alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".toCharArray();
        return NanoIdUtils.randomNanoId(random, alphabet, 7);
    }
}
