package com.todoly.base;

import io.restassured.RestAssured;
import io.qameta.allure.restassured.AllureRestAssured;
import org.junit.jupiter.api.BeforeAll;

public class BaseTest {

    @BeforeAll
    public static void setup() {

        RestAssured.baseURI = "https://todo.ly";
        RestAssured.filters(new AllureRestAssured());

    }
}
