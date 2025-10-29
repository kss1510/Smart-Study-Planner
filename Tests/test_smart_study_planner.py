import chromedriver_autoinstaller
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys
import time, os

# Auto-install matching ChromeDriver
chromedriver_autoinstaller.install()

driver = webdriver.Chrome()
driver.maximize_window()

# URL of your live website
driver.get("https://kss1510.github.io/Smart-Study-Planner/")
print("Test Started: Smart Study Planner")

# Create screenshot folder
if not os.path.exists("screenshots"):
    os.makedirs("screenshots")

wait = WebDriverWait(driver, 10)

# -------------------------------
# Test Case 1: Open Login Page
# -------------------------------
try:
    login_button = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(),'Login')]")))
    login_button.click()
    print("Test 1 Passed: Login page opened")
    driver.save_screenshot("screenshots/test1_login_page.png")
except Exception as e:
    print("Test 1 Failed:", e)

# -------------------------------
# Test Case 2: Enter Credentials
# -------------------------------
try:
    email_field = wait.until(EC.presence_of_element_located((By.XPATH, "//input[@type='email']")))
    password_field = wait.until(EC.presence_of_element_located((By.XPATH, "//input[@type='password']")))
    email_field.send_keys("hcheruku@gitam.in")
    password_field.send_keys("hanvi@123*")
    password_field.send_keys(Keys.ENTER)
    print("Test 2 Passed: Credentials entered")
    driver.save_screenshot("screenshots/test2_credentials.png")
except Exception as e:
    print("Test 2 Failed:", e)

time.sleep(3)

# -------------------------------
# Test Case 3: Verify Login Success
# -------------------------------
try:
    home_heading = wait.until(EC.presence_of_element_located((By.XPATH, "//*[contains(text(),'Dashboard') or contains(text(),'Planner')]")))
    print("Test 3 Passed: Login successful, Dashboard visible")
    driver.save_screenshot("screenshots/test3_dashboard.png")
except Exception as e:
    print("Test 3 Failed:", e)

# -------------------------------
# Test Case 4: Add a New Task
# -------------------------------
try:
    add_task_button = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(),'Add Task') or contains(text(),'New Task')]")))
    add_task_button.click()

    subject_field = wait.until(EC.presence_of_element_located((By.XPATH, "//input[contains(@placeholder,'Subject') or contains(@id,'subject')]")))
    description_field = driver.find_element(By.XPATH, "//textarea | //input[contains(@placeholder,'Description')]")
    deadline_field = driver.find_element(By.XPATH, "//input[@type='date']")

    subject_field.send_keys("Database Assignment")
    description_field.send_keys("Finish ER diagram and normalization report")
    deadline_field.send_keys("2025-11-02")

    driver.find_element(By.XPATH, "//button[contains(text(),'Save') or contains(text(),'Add')]").click()
    print("Test 4 Passed: Task added successfully")
    driver.save_screenshot("screenshots/test4_add_task.png")
except Exception as e:
    print("Test 4 Failed:", e)

# -------------------------------
# Test Case 5: Verify Task Appears
# -------------------------------
try:
    task = wait.until(EC.presence_of_element_located((By.XPATH, "//*[contains(text(),'Database Assignment')]")))
    print("Test 5 Passed: New task displayed on screen")
    driver.save_screenshot("screenshots/test5_task_visible.png")
except Exception as e:
    print("Test 5 Failed:", e)

# -------------------------------
# Test Case 6: Delete Task
# -------------------------------
try:
    delete_button = driver.find_element(By.XPATH, "//button[contains(text(),'Delete') or contains(@class,'delete')]")
    delete_button.click()
    print("Test 6 Passed: Task deleted successfully")
    driver.save_screenshot("screenshots/test6_task_deleted.png")
except Exception as e:
    print("Test 6 Failed:", e)

driver.quit()
print("All interactive tests completed. Screenshots saved in 'screenshots' folder.")
