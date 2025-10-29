import chromedriver_autoinstaller
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import os, time

# ✅ Auto install the correct ChromeDriver version
chromedriver_autoinstaller.install()

driver = webdriver.Chrome()
driver.maximize_window()

# create screenshot folder
os.makedirs("screenshots", exist_ok=True)

driver.get("https://kss1510.github.io/Smart-Study-Planner/")
print("Test Started: Smart Study Planner")

wait = WebDriverWait(driver, 10)

# Test 1: Homepage title
try:
    assert "Smart Study Planner" in driver.title
    print("Test 1 Passed: Homepage loaded successfully")
    driver.save_screenshot("screenshots/test1_homepage.png")
except AssertionError:
    print("Test 1 Failed: Homepage title mismatch")

# Test 2: Check for email input
try:
    email_input = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "input[type='email']")))
    print("Test 2 Passed: Email field found")
    driver.save_screenshot("screenshots/test2_email_found.png")
except:
    print("Test 2 Failed: Login email field missing")

# Test 3: Check for password input
try:
    password_input = driver.find_element(By.CSS_SELECTOR, "input[type='password']")
    print("Test 3 Passed: Password field found")
    driver.save_screenshot("screenshots/test3_password_found.png")
except:
    print("Test 3 Failed: Password field missing")

# Test 4: Check for login button
try:
    login_button = driver.find_element(By.XPATH, "//button[contains(text(), 'Log In')]")
    print("Test 4 Passed: Login button found")
    driver.save_screenshot("screenshots/test4_login_button.png")
except:
    print("Test 4 Failed: Login button not found")

# Test 5: Check for "Help" or "Troubleshooting" section
try:
    help_button = driver.find_element(By.XPATH, "//*[contains(text(),'trouble')]")
    print("Test 5 Passed: Help section found")
    driver.save_screenshot("screenshots/test5_help_section.png")
except:
    print("Test 5 Failed: Help section not found")

driver.quit()
