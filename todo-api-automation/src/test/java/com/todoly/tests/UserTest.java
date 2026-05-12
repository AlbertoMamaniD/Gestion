package com.todoly.tests;

import com.todoly.base.BaseTest;
import io.qameta.allure.Description;
import io.qameta.allure.Owner;
import io.restassured.http.ContentType;
import io.restassured.response.Response;
import org.junit.jupiter.api.*;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.equalTo;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class UserTest extends BaseTest {

    static int userId;

    static String email = "alberto" + System.currentTimeMillis() + "@mail.com";
    static String password = "123456";

    @Test
    @Order(1)
    @Description("Create user")
    @Owner("Alberto Mamani")
    public void createUserTest() {

        String body = """
                {
                    "Email": "%s",
                    "FullName": "Alberto Mamani",
                    "Password": "%s"
                }
                """.formatted(email, password);

        Response response =
                given()
                        .contentType(ContentType.JSON)
                        .body(body)
                .when()
                        .post("/api/user.json")
                .then()
                        .statusCode(200)
                        .body("FullName", equalTo("Alberto Mamani"))
                        .extract().response();

        userId = response.jsonPath().getInt("Id");

        System.out.println("USER ID: " + userId);
    }

    @Test
    @Order(2)
    @Description("Get user")
    public void getUserTest() {

        given()
                .auth()
                .preemptive()
                .basic(email, password)

        .when()
                .get("/api/user.json")

        .then()
                .statusCode(200)
                .body("Email", equalTo(email));
    }

    @Test
    @Order(3)
    @Description("Update user")
    public void updateUserTest() {

        String body = """
                {
                    "FullName": "Alberto Mamani Actualizado"
                }
                """;

        given()
                .auth()
                .preemptive()
                .basic(email, password)
                .contentType(ContentType.JSON)
                .body(body)

        .when()
                .put("/api/user/" + userId + ".json")

        .then()
                .statusCode(200)
                .body("FullName", equalTo("Alberto Mamani Actualizado"));
    }

    @Test
    @Order(4)
    @Description("Delete user")
    public void deleteUserTest() {

        given()
                .auth()
                .preemptive()
                .basic(email, password)

        .when()
                .delete("/api/user/" + userId + ".json")

        .then()
                .statusCode(200);
    }
}
