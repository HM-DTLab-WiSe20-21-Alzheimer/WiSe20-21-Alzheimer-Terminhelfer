package thecoronials.models;

import java.util.Objects;

public class Location {
    private final String street;
    private final String houseNumber;
    private final String postalCode;
    private final String city;
    private final String coordinates;

    public Location(String street, String houseNumber, String postalCode, String city, String coordinates) {
        this.street = Objects.requireNonNull(street, "Street is required");
        this.houseNumber = houseNumber;
        this.postalCode = Objects.requireNonNull(postalCode, "Postal code is required");
        this.city = Objects.requireNonNull(city, "City is required");
        this.coordinates = Objects.requireNonNull(coordinates, "Coordinates are required");
    }

    public String getStreet() {
        return street;
    }

    public String getHouseNumber() {
        return houseNumber;
    }

    public String getPostalCode() {
        return postalCode;
    }

    public String getCity() {
        return city;
    }

    public String getCoordinates() {
        return coordinates;
    }

    public String getAddress() {
        final String houseNumberSpaced = getHouseNumber() == null ? "" : (" " + getHouseNumber());
        return getStreet() + houseNumberSpaced + ", " + getPostalCode() + " " + getCity();
    }
}
