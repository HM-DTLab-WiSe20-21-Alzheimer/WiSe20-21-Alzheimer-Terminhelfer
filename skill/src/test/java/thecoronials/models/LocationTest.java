package thecoronials.models;

import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;

public class LocationTest {

    @Test(expected = NullPointerException.class)
    public void requiresStreet() {
        new Location(null, "", "", "", "");
    }

    @Test(expected = NullPointerException.class)
    public void requiresPostalCode() {
        new Location("", "", null, "", "");
    }

    @Test(expected = NullPointerException.class)
    public void requiresCity() {
        new Location("", "", "", null, "");
    }

    @Test(expected = NullPointerException.class)
    public void requiresCoordinates() {
        new Location("", "", "", "", null);
    }

    @Test
    public void setsAllData() {
        // arrange
        final String street = "Lothstraße";
        final String houseNumber = "64";
        final String postalCode = "80335";
        final String city = "München";
        final String coordinates = "48.15505,11.55581";

        // act
        final Location location = new Location(street, houseNumber, postalCode, city, coordinates);

        // assert
        assertEquals(street, location.getStreet());
        assertEquals(houseNumber, location.getHouseNumber());
        assertEquals(postalCode, location.getPostalCode());
        assertEquals(city, location.getCity());
        assertEquals(coordinates, location.getCoordinates());
    }

    @Test
    public void setsAllDataWithNullHouseNumber() {
        // arrange
        final String street = "Lothstraße";
        final String postalCode = "80335";
        final String city = "München";
        final String coordinates = "48.15505,11.55581";

        // act
        final Location location = new Location(street, null, postalCode, city, coordinates);

        // assert
        assertEquals(street, location.getStreet());
        assertNull(location.getHouseNumber());
        assertEquals(postalCode, location.getPostalCode());
        assertEquals(city, location.getCity());
        assertEquals(coordinates, location.getCoordinates());
    }

    @Test
    public void getAddress() {
        // arrange
        final Location location = new Location(
                "Lothstraße",
                "64",
                "80335",
                "München",
                "48.15505,11.55581"
        );

        final String want = "Lothstraße 64, 80335 München";

        // act
        final String have = location.getAddress();

        // assert
        assertEquals(want, have);
    }

    @Test
    public void getAddressWithoutHouseNumber() {
        // arrange
        final Location location = new Location(
                "Lothstraße",
                null,
                "80335",
                "München",
                "48.15505,11.55581"
        );

        final String want = "Lothstraße, 80335 München";

        // act
        final String have = location.getAddress();

        // assert
        assertEquals(want, have);
    }

}
