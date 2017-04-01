module.exports = {
    "src_folders": [
        "e2e-tests"
    ],
    "output_folder": "e2e-reports",
    "custom_commands_path": "",
    "custom_assertions_path": "",
    "page_objects_path": "e2e-po",
    "globals_path": "",
    "selenium": {
        "start_process": true,
        "server_path": "bin/selenium-server-standalone-3.3.1.jar",
        "log_path": "",
        "port": 4444,
        "cli_args": {
            "webdriver.chrome.driver": "bin/chromedriver.exe"
        }
    },
    "test_runner": {
        "type": "mocha",
        "options": {
            // "grep": "can search",
            "bail": true
        }
    },
    "test_settings": {
        "default": {
            "launch_url": "http://localhost:8000",
            "selenium_port": 4444,
            "selenium_host": "localhost",
            "silent": true,
            "screenshots": {
                "enabled": false,
                "path": ""
            },
            "globals": {
                "waitForConditionTimeout": 1000
            },
            "desiredCapabilities": {
                "browserName": "chrome",
                "chromeOptions": {
                    "args": [
                        "start-maximized"
                    ]
                }
            }
        }
    }
};