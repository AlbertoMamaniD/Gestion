package com.example.calculator.junit;

import com.example.calculator.Calculator;
import org.junit.jupiter.api.*;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

import static org.junit.jupiter.api.Assertions.*;

public class CalculatorJUnitTest {

    Calculator calculator;

    @BeforeEach
    void setup() {
        calculator = new Calculator();
        System.out.println("Iniciando prueba - Alberto Mamani");
    }

    @AfterEach
    void teardown() {
        System.out.println("Finalizando prueba - Alberto Mamani");
    }

    @Test
    @DisplayName("Validate addition")
    void testAdd() {

        int result = calculator.add(5, 3);

        assertEquals(8, result);
    }

    @Test
    @DisplayName("Validate subtraction")
    void testSubtract() {

        int result = calculator.subtract(10, 4);

        assertEquals(6, result);
    }

    @Test
    @DisplayName("Validate multiplication")
    void testMultiply() {

        int result = calculator.multiply(2, 5);

        assertEquals(10, result);
    }

    @Test
    @DisplayName("Validate division")
    void testDivide() {

        double result = calculator.divide(10, 2);

        assertEquals(5.0, result);
    }

    @Test
    @DisplayName("Validate division by zero")
    void testDivideByZero() {

        Exception exception = assertThrows(
                ArithmeticException.class,
                () -> calculator.divide(10, 0)
        );

        assertEquals("Cannot divide by zero", exception.getMessage());
    }

    @ParameterizedTest
    @DisplayName("Validate addition with ParameterizedTest")
    @CsvSource({
            "1,2,3",
            "5,5,10",
            "10,20,30"
    })
    void testAddParameterized(int a, int b, int expected) {
        assertEquals(expected, calculator.add(a, b));
    }
}
