package com.todoly.unitTest;

import org.junit.jupiter.api.*;
import static org.junit.jupiter.api.Assertions.*;

public class CalculatorUnitTest {

    Calculator calculator;

    @BeforeAll
    public static void setup1() {
        System.out.println("Unit test autor: Alberto Mamani");
        System.out.println("");
    }

    @BeforeEach
    public void setup() {
        calculator = new Calculator();
        System.out.println("Before each test");
    }

    @AfterEach
    public void teardown() {
        System.out.println("After each test");
        System.out.println("---------------------------------------------------");
    }

    @AfterAll
    public static void end() {
        System.out.println("Tarija, Bolivia 12/05/2026");
    }

    @Test
    public void testAdd() {
        int result = calculator.add(5, 3);
        assertEquals(8, result);
        System.out.println("Test addition completed");
    }

    @Test
    public void testSubtract() {
        int result = calculator.subtract(10, 4);
        assertEquals(6, result);
        System.out.println("Test subtraction completed");
    }

    @Test
    public void testMultiply() {
        int result = calculator.multiply(2, 5);
        assertEquals(10, result);
        System.out.println("Test multiplication completed");
    }

    @Test
    public void testDivide() {
        double result = calculator.divide(10, 2);
        assertEquals(5.0, result);
        System.out.println("Test division completed");
    }

    @Test
    public void testDivideByZero() {
        assertThrows(ArithmeticException.class, () -> calculator.divide(10, 0));
        System.out.println("Test division by zero completed");
    }
}
