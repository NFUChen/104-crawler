from selenium import webdriver

# For Firefox Node 1
driver1 = webdriver.Remote(
    command_executor='http://localhost:4445/wd/hub',
    desired_capabilities=webdriver.DesiredCapabilities.FIREFOX
)

# For Firefox Node 2
driver2 = webdriver.Remote(
    command_executor='http://localhost:4446/wd/hub',
    desired_capabilities=webdriver.DesiredCapabilities.FIREFOX
)

# Your automation code for Firefox Node 1

# Your automation code for Firefox Node 2

driver1.quit()
driver2.quit()