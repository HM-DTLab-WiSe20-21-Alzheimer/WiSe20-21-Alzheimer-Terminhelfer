package thecoronials.utils;

import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.Timeout;

import java.util.Random;

import static org.junit.Assert.assertEquals;

public class LinkIdGeneratorTest {
    @Rule
    public Timeout globalTimeout = Timeout.seconds(1);

    private static Random seededGenerator;

    @Before
    public void init() {
        seededGenerator = new Random(15122020);
    }

    @Test
    public void randomLength() {
        // arrange
        final int want = 7;
        // act
        final int have = new LinkIdGenerator().create().length();
        // assert
        assertEquals(want, have);
    }

    @Test
    public void seededLength() {
        // arrange
        final int want = 7;
        // act
        final int have = new LinkIdGenerator(seededGenerator).create().length();
        // assert
        assertEquals(want, have);
    }

    @Test
    public void seededContent() {
        // arrange
        final String want = "LLK26SM";
        // act
        final String have = new LinkIdGenerator(seededGenerator).create();
        // assert
        assertEquals(want, have);
    }
}
