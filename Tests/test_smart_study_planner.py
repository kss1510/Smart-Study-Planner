# test_smart_study_planner.py

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
import time

# 🔹 Initialize Chrome WebDriver (update path if needed)
driver = webdriver.Chrome(executable_path=r"D:\Smart-Study-Planner\Tests\chromedriver.exe")

# 🔹 Open the Smart Study Planner website
driver.get("https://kss1510.github.io/Smart-Study-Planner/")   # change to your actual running URL
driver.maximize_window()

print("✅ Test Started: Smart Study Planner")

# 🧩 Test Case 1: Verify Homepage Load
try:
    assert "Smart Study Planner" in driver.title
    print("✅ Test 1 Passed: Homepage loaded successfully")
except AssertionError:
    print("❌ Test 1 Failed: Homepage title mismatch")

time.sleep(2)

# 🧩 Test Case 2: Check Login Page Components
try:
    email_input = driver.find_element(By.ID, "email")
    password_input = driver.find_element(By.ID, "password")
    login_button = driver.find_element(By.XPATH, "//button[contains(text(),'Log In')]")
    print("✅ Test 2 Passed: Login fields and button found")
except:
    print("❌ Test 2 Failed: Login fields missing")

time.sleep(2)

# 🧩 Test Case 3: Invalid Login Attempt
try:
    email_input.send_keys("fakeuser@gmail.com")
    password_input.send_keys("wrongpassword")
    login_button.click()
    time.sleep(3)
    error_message = driver.find_element(By.XPATH, "//*[contains(text(),'incorrect')]")
    print("✅ Test 3 Passed: Error displayed for invalid credentials")
except:
    print("❌ Test 3 Failed: Error message not displayed")

time.sleep(2)

# 🧩 Test Case 4: Theme Toggle (if exists)
try:
    theme_button = driver.find_element(By.XPATH, "//*[contains(text(),'Dark') or contains(text(),'Light')]")
    theme_button.click()
    print("✅ Test 4 Passed: Theme toggled successfully")
except:
    print("⚠️ Test 4 Skipped: Theme toggle not found")

time.sleep(2)

# 🧩 Test Case 5: Quick Start / Help Section
try:
    help_button = driver.find_element(By.XPATH, "//*[contains(text(),'Having trouble') or contains(text(),'Help')]")
    help_button.click()
    time.sleep(2)
    print("✅ Test 5 Passed: Help section opened successfully")
except:
    print("❌ Test 5 Failed: Help section not found")

# 🧩 Wrap Up
print("\n🎯 All test cases executed. Closing browser in 3 seconds...")
time.sleep(3)
driver.quit()
