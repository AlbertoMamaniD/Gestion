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
public class ProjectTest extends BaseTest {

    static int projectId;

    // Use a unique email base matching the user's name for project tests
    static String email = "albertomamaniesteban.proj" + System.currentTimeMillis() + "@gmail.com";
    static String password = "password123";

    @BeforeAll
    public static void createTestUser() {
        String body = """
                {
                    "Email": "%s",
                    "FullName": "Alberto Mamani Esteban Proyectos",
                    "Password": "%s"
                }
                """.formatted(email, password);

        given()
                .contentType(ContentType.JSON)
                .body(body)
        .when()
                .post("/api/user.json")
        .then()
                .statusCode(200);
    }

    @AfterAll
    public static void deleteTestUser() {
        given()
                .auth()
                .preemptive()
                .basic(email, password)
        .when()
                .delete("/api/user/0.json")
        .then()
                .statusCode(200);
    }

    @Test
    @Order(1)
    @Description("Create a new project")
    @Owner("Alberto Mamani Esteban")
    public void createProjectTest() {
        String body = """
                {
                    "Content": "Alberto Mamani Esteban Project",
                    "Icon": 4
                }
                """;

        Response response =
                given()
                        .auth()
                        .preemptive()
                        .basic(email, password)
                        .contentType(ContentType.JSON)
                        .body(body)
                .when()
                        .post("/api/projects.json")
                .then()
                        .statusCode(200)
                        .body("Content", equalTo("Alberto Mamani Esteban Project"))
                        .body("Icon", equalTo(4))
                        .extract().response();

        projectId = response.jsonPath().getInt("Id");
        System.out.println("PROJECT ID CREATED: " + projectId);
    }

    @Test
    @Order(2)
    @Description("Get project by ID")
    @Owner("Alberto Mamani Esteban")
    public void getProjectTest() {
        given()
                .auth()
                .preemptive()
                .basic(email, password)
        .when()
                .get("/api/projects/" + projectId + ".json")
        .then()
                .statusCode(200)
                .body("Id", equalTo(projectId))
                .body("Content", equalTo("Alberto Mamani Esteban Project"))
                .body("Icon", equalTo(4));
    }

    @Test
    @Order(3)
    @Description("Update project by ID")
    @Owner("Alberto Mamani Esteban")
    public void updateProjectTest() {
        String body = """
                {
                    "Content": "Alberto Mamani Esteban Project Updated",
                    "Icon": 5
                }
                """;

        given()
                .auth()
                .preemptive()
                .basic(email, password)
                .contentType(ContentType.JSON)
                .body(body)
        .when()
                .put("/api/projects/" + projectId + ".json")
        .then()
                .statusCode(200)
                .body("Id", equalTo(projectId))
                .body("Content", equalTo("Alberto Mamani Esteban Project Updated"))
                .body("Icon", equalTo(5));
    }

    @Test
    @Order(4)
    @Description("Delete project by ID")
    @Owner("Alberto Mamani Esteban")
    public void deleteProjectTest() {
        given()
                .auth()
                .preemptive()
                .basic(email, password)
        .when()
                .delete("/api/projects/" + projectId + ".json")
        .then()
                .statusCode(200)
                .body("Id", equalTo(projectId))
                .body("Content", equalTo("Alberto Mamani Esteban Project Updated"))
                .body("Icon", equalTo(5))
                .body("Deleted", equalTo(true));
    }
}
