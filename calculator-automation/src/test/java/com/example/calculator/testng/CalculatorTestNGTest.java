package com.example.calculator.testng;

import com.example.calculator.Calculator;
import org.testng.Assert;
import org.testng.annotations.*;

public class CalculatorTestNGTest {

    Calculator calculator;

    @BeforeMethod
    public void setup() {

        calculator = new Calculator();

        System.out.println("Iniciando método - Alberto Mamani");
    }

    @AfterMethod
    public void teardown() {

        System.out.println("Finalizando método - Alberto Mamani");
    }

    @Test(description = "Validate addition")
    public void testAdd() {

        int result = calculator.add(2, 3);

        Assert.assertEquals(result, 5);
    }

    @Test(description = "Validate subtraction")
    public void testSubtract() {

        int result = calculator.subtract(10, 4);

        Assert.assertEquals(result, 6);
    }

    @Test(description = "Validate multiplication")
    public void testMultiply() {

        int result = calculator.multiply(3, 4);

        Assert.assertEquals(result, 12);
    }

    @Test(description = "Validate division")
    public void testDivide() {

        double result = calculator.divide(20, 5);

        Assert.assertEquals(result, 4.0);
    }

    @Test(
            description = "Validate division by zero",
            expectedExceptions = ArithmeticException.class
    )
    public void testDivideByZero() {

        calculator.divide(10, 0);
    }

    @DataProvider(name = "sumData")
    public Object[][] sumData() {

        return new Object[][]{
                {1, 2, 3},
                {5, 5, 10},
                {10, 20, 30}
        };
    }

    @Test(dataProvider = "sumData", description = "Validate addition with DataProvider")
    public void testAddDataProvider(int a, int b, int expected) {
        Assert.assertEquals(calculator.add(a, b), expected);
    }
}
