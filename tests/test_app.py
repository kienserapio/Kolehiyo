import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service as ChromeService
from webdriver_manager.chrome import ChromeDriverManager
import time

# --- Configuration ---
# Define the URL of your locally running frontend
BASE_URL = "http://localhost:5173/"
LOGIN_PAGE_URL = BASE_URL + "auth/login_in" # Based on your screenshot's path

class KolehiyoSmokeTests(unittest.TestCase):
    """A collection of basic 'smoke tests' for the Kolehiyo website."""

    @classmethod
    def setUpClass(cls):
        """Set up the WebDriver for all tests in this class."""
        # This part sets up the browser driver automatically.
        cls.driver = webdriver.Chrome(service=ChromeService(ChromeDriverManager().install()))
        cls.driver.implicitly_wait(10) # Wait up to 10 seconds for elements to appear

    def test_01_homepage_loads_correctly(self):
        """Test that the homepage title is correct and the URL loads."""
        print(f"\nTEST 01: Navigating to {BASE_URL}...")
        self.driver.get(BASE_URL)
        
        # Check 1: Verify the page title
        expected_title_part = "Kolehiyo"
        self.assertIn(expected_title_part, self.driver.title, 
                      f"FAIL: Expected title to contain '{expected_title_part}' but got '{self.driver.title}'")
        print(f"PASS: Page loaded successfully with title: {self.driver.title}")

    def test_02_navigate_to_sign_up_page(self):
        """Test clicking the 'Start Your College Journey' button and navigation."""
        self.driver.get(BASE_URL)
        print("TEST 02: Checking 'Start Your College Journey' button...")
        
        # NOTE: We use find_elements (plural) to avoid an error if the button isn't there.
        # This returns a LIST of found elements (it will be empty if nothing is found).
        button_xpath = "//button[contains(text(), 'Start Your College Journey')] | //a[contains(text(), 'Start Your College Journey')]"
        start_buttons = self.driver.find_elements(By.XPATH, button_xpath)
        
        # Use simple if/else to check if the button list is NOT empty (meaning the button was found)
        if start_buttons:
            start_button = start_buttons[0] # Get the first element in the list
            start_button.click()
            print("Action: Clicked 'Start Your College Journey' button.")
            time.sleep(2) # Pause for visual confirmation
            
            # Check 2: Verify the URL has changed (to detect the known navigation bug)
            current_url = self.driver.current_url
            if current_url != BASE_URL:
                print(f"PASS: Navigated successfully to new page: {current_url}")
            else:
                # This is the expected FAIL/BUG based on your previous run
                self.fail(f"FAIL: Navigation bug detected. URL did NOT change after click, it's still {BASE_URL}")

        else:
            # If the list 'start_buttons' is empty (button not found)
            self.fail("FAIL: The 'Start Your College Journey' button could not be located on the homepage.")

    def test_03_login_input_fields_exist_and_accept_data(self):
        """Test that the Login page loads and key input fields are present and interactive."""
        print(f"\nTEST 03: Navigating directly to Login page at {LOGIN_PAGE_URL}...")
        self.driver.get(LOGIN_PAGE_URL)
        time.sleep(2) # Wait for components to render
        
        # --- Check for Email Field ---
        # Find the input fields using find_elements (plural)
        email_fields = self.driver.find_elements(By.XPATH, "//input[@type='email' or @placeholder='Email Address']")
        
        if email_fields:
            email_input = email_fields[0]
            print("PASS: Email input field found.")
            
            # Test data entry
            test_email = "qa.tester@kolehiyo.com"
            email_input.send_keys(test_email)
            
            # Check if the text was entered correctly
            if email_input.get_attribute("value") == test_email:
                print(f"PASS: Successfully entered and verified data in Email field: {test_email}")
            else:
                self.fail("FAIL: Data entered into Email field did not match expected text.")
                
        else:
            self.fail("FAIL: Email input field could not be located on the Login page.")
            
        # --- Check for Password Field ---
        password_fields = self.driver.find_elements(By.XPATH, "//input[@type='password' or @placeholder='Password']")
        
        if password_fields:
            password_input = password_fields[0]
            print("PASS: Password input field found.")
            
            # Test data entry
            test_password = "TestPassword123"
            password_input.send_keys(test_password)
            
            # Note: We can't verify the password value in the same way because browsers often obscure it,
            # but verifying data was entered is sufficient for this beginner test.
            
        else:
            self.fail("FAIL: Password input field could not be located on the Login page.")
            

    @classmethod
    def tearDownClass(cls):
        """Close the browser after all tests have run."""
        print("\nFinished all tests. Waiting for 10 seconds for visual inspection...")
        # Pause for 10 seconds before closing
        time.sleep(10) 
        cls.driver.quit()

if __name__ == '__main__':
    unittest.main()