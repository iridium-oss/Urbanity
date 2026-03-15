#!/usr/bin/env python3
"""
IRIDIUM Backend API Testing Suite
Tests all API endpoints using the external URL
"""

import requests
import sys
import json
from datetime import datetime

class IridiumAPITester:
    def __init__(self, base_url="https://urban-transit-os.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.failures = []

    def run_test(self, name, endpoint, expected_status=200, expected_keys=None, method="GET", data=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)
            else:
                raise ValueError(f"Unsupported method: {method}")

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                
                # Verify response content if keys specified
                if expected_keys:
                    try:
                        response_data = response.json()
                        for key in expected_keys:
                            if key not in response_data:
                                print(f"⚠️  Warning: Expected key '{key}' not found in response")
                            else:
                                print(f"   ✓ Found key: {key}")
                    except json.JSONDecodeError:
                        print(f"⚠️  Warning: Response is not valid JSON")
                        
                return True, response.json() if response.text else {}
            else:
                self.tests_passed -= 1
                error_msg = f"Expected {expected_status}, got {response.status_code}"
                print(f"❌ Failed - {error_msg}")
                self.failures.append(f"{name}: {error_msg}")
                try:
                    print(f"   Response: {response.text[:200]}")
                except:
                    pass
                return False, {}

        except requests.exceptions.Timeout:
            error_msg = "Request timeout (10s)"
            print(f"❌ Failed - {error_msg}")
            self.failures.append(f"{name}: {error_msg}")
            return False, {}
        except requests.exceptions.ConnectionError:
            error_msg = "Connection error - server may be down"
            print(f"❌ Failed - {error_msg}")
            self.failures.append(f"{name}: {error_msg}")
            return False, {}
        except Exception as e:
            error_msg = f"Error: {str(e)}"
            print(f"❌ Failed - {error_msg}")
            self.failures.append(f"{name}: {error_msg}")
            return False, {}

    def test_health_endpoint(self):
        """Test basic health/status endpoint"""
        return self.run_test(
            "API Health Check",
            "",
            200,
            ["message", "version", "status"]
        )

    def test_dashboard_overview(self):
        """Test dashboard overview stats"""
        return self.run_test(
            "Dashboard Overview",
            "dashboard/overview",
            200,
            ["total_modes", "active_providers", "active_alerts", "daily_trips_estimate"]
        )

    def test_mobility_modes(self):
        """Test mobility modes endpoint"""
        success, data = self.run_test(
            "Mobility Modes",
            "mobility-modes",
            200
        )
        if success and isinstance(data, list):
            print(f"   ✓ Found {len(data)} mobility modes")
            if len(data) >= 14:
                print(f"   ✓ Expected 14+ modes, found {len(data)}")
            else:
                print(f"   ⚠️  Expected 14+ modes, only found {len(data)}")
        return success, data

    def test_providers(self):
        """Test providers endpoint"""
        success, data = self.run_test(
            "Data Providers",
            "providers",
            200
        )
        if success and isinstance(data, list):
            print(f"   ✓ Found {len(data)} providers")
            if len(data) >= 13:
                print(f"   ✓ Expected 13+ providers, found {len(data)}")
            else:
                print(f"   ⚠️  Expected 13+ providers, only found {len(data)}")
        return success, data

    def test_alerts(self):
        """Test alerts endpoint with various filters"""
        # Test all alerts
        success, data = self.run_test(
            "All Alerts",
            "alerts",
            200
        )
        if success and isinstance(data, list):
            print(f"   ✓ Found {len(data)} total alerts")
            
        # Test active alerts filter
        active_success, active_data = self.run_test(
            "Active Alerts",
            "alerts?status=active",
            200
        )
        if active_success:
            print(f"   ✓ Found {len(active_data)} active alerts")
            
        # Test resolved alerts filter
        resolved_success, resolved_data = self.run_test(
            "Resolved Alerts",
            "alerts?status=resolved",
            200
        )
        if resolved_success:
            print(f"   ✓ Found {len(resolved_data)} resolved alerts")

        return success and active_success and resolved_success, data

    def test_transit_network(self):
        """Test transit network endpoint"""
        return self.run_test(
            "Transit Network",
            "transit/network",
            200,
            ["lines", "total_stations", "total_routes"]
        )

    def test_routing_demo(self):
        """Test demo routing endpoint"""
        success, data = self.run_test(
            "Demo Routing",
            "routing/demo",
            200,
            ["origin", "destination", "options"]
        )
        if success and "options" in data:
            print(f"   ✓ Found {len(data['options'])} route options")
            if len(data['options']) >= 4:
                print(f"   ✓ Expected 4+ route options, found {len(data['options'])}")
        return success, data

    def test_congestion_forecasting(self):
        """Test congestion forecasting endpoint"""
        # Test default corridor
        success, data = self.run_test(
            "Congestion Forecast (default)",
            "forecasting/congestion",
            200,
            ["corridor", "forecast", "model"]
        )
        
        # Test specific corridor
        corridor_success, corridor_data = self.run_test(
            "Congestion Forecast (Tbilisi Ave)",
            "forecasting/congestion?corridor=Tbilisi Ave",
            200,
            ["corridor", "forecast", "model"]
        )
        
        return success and corridor_success, data

    def test_equity_districts(self):
        """Test equity districts endpoint"""
        success, data = self.run_test(
            "Equity Districts",
            "equity/districts",
            200
        )
        if success and isinstance(data, list):
            print(f"   ✓ Found {len(data)} districts")
            if len(data) >= 12:
                print(f"   ✓ Expected 12+ districts, found {len(data)}")
        return success, data

    def test_earth_observation(self):
        """Test earth observation endpoint"""
        return self.run_test(
            "Earth Observation",
            "earth-observation",
            200,
            ["last_capture", "satellite", "layers"]
        )

    def test_demo_guide(self):
        """Test demo guide endpoint"""
        success, data = self.run_test(
            "Demo Guide",
            "demo/guide",
            200,
            ["steps", "total_duration_min"]
        )
        if success and "steps" in data:
            print(f"   ✓ Found {len(data['steps'])} guide steps")
            if len(data['steps']) >= 8:
                print(f"   ✓ Expected 8+ steps, found {len(data['steps'])}")
        return success, data

    def test_demo_reset(self):
        """Test demo reset endpoint"""
        return self.run_test(
            "Demo Reset",
            "demo/reset",
            200,
            ["status", "message"],
            method="POST"
        )
    
    def test_user_roles(self):
        """Test GET /api/auth/roles endpoint"""
        success, data = self.run_test(
            "User Roles",
            "auth/roles",
            200
        )
        if success and isinstance(data, list):
            print(f"   ✓ Found {len(data)} user roles")
            expected_roles = ['executive', 'b2g', 'b2b', 'b2c', 'technical']
            found_roles = [role['id'] for role in data if 'id' in role]
            for expected_role in expected_roles:
                if expected_role in found_roles:
                    print(f"   ✓ Found role: {expected_role}")
                else:
                    print(f"   ⚠️  Missing role: {expected_role}")
                    
            if len(data) >= 5:
                print(f"   ✓ Expected 5 roles, found {len(data)}")
            else:
                print(f"   ⚠️  Expected 5 roles, only found {len(data)}")
        return success, data

    def test_login(self):
        """Test POST /api/auth/login endpoint"""
        test_data = {
            "name": "Test User",
            "email": "test@example.com", 
            "role": "executive"
        }
        
        success, data = self.run_test(
            "User Login",
            "auth/login",
            200,
            ["id", "name", "email", "role", "role_name", "logged_in_at"],
            method="POST",
            data=test_data
        )
        
        if success:
            print(f"   ✓ Login successful for user: {data.get('name')}")
            print(f"   ✓ Role: {data.get('role')} ({data.get('role_name')})")
            if data.get('id'):
                print(f"   ✓ User ID generated: {data.get('id')}")
                
        return success, data
        
    def test_login_validation(self):
        """Test login validation - missing fields should return error"""
        # Test missing name
        test_cases = [
            {"email": "test@example.com", "role": "executive"},  # missing name
            {"name": "Test User", "role": "executive"},         # missing email
            {"name": "Test User", "email": "test@example.com"}, # missing role
            {"name": "", "email": "test@example.com", "role": "executive"}, # empty name
        ]
        
        all_success = True
        for i, test_data in enumerate(test_cases):
            print(f"\n🔍 Testing Login Validation Case {i+1}...")
            print(f"   Data: {test_data}")
            
            try:
                url = f"{self.base_url}/auth/login"
                response = requests.post(url, json=test_data, headers={'Content-Type': 'application/json'}, timeout=10)
                
                # Should return 200 but with error message in response
                if response.status_code == 200:
                    response_data = response.json()
                    if "error" in response_data:
                        print(f"   ✅ Validation working - Error: {response_data['error']}")
                    else:
                        print(f"   ❌ Expected validation error, but login succeeded")
                        all_success = False
                else:
                    print(f"   ❌ Expected 200 with error, got {response.status_code}")
                    all_success = False
                    
            except Exception as e:
                print(f"   ❌ Error testing validation: {str(e)}")
                all_success = False
                
        return all_success, {}

def main():
    print("🚀 Starting IRIDIUM Backend API Testing")
    print("=" * 60)
    
    tester = IridiumAPITester()
    
    # Run all tests
    test_functions = [
        tester.test_health_endpoint,
        tester.test_user_roles,
        tester.test_login,
        tester.test_login_validation,
        tester.test_dashboard_overview,
        tester.test_mobility_modes,
        tester.test_providers,
        tester.test_alerts,
        tester.test_transit_network,
        tester.test_routing_demo,
        tester.test_congestion_forecasting,
        tester.test_equity_districts,
        tester.test_earth_observation,
        tester.test_demo_guide,
        tester.test_demo_reset,
    ]
    
    for test_func in test_functions:
        try:
            test_func()
        except Exception as e:
            print(f"❌ Test function error: {str(e)}")
            tester.failures.append(f"{test_func.__name__}: {str(e)}")
    
    # Print summary
    print("\n" + "=" * 60)
    print(f"📊 Test Summary:")
    print(f"   Tests run: {tester.tests_run}")
    print(f"   Tests passed: {tester.tests_passed}")
    print(f"   Success rate: {(tester.tests_passed/tester.tests_run*100):.1f}%" if tester.tests_run > 0 else "N/A")
    
    if tester.failures:
        print(f"\n❌ Failures ({len(tester.failures)}):")
        for failure in tester.failures:
            print(f"   • {failure}")
    else:
        print(f"\n✅ All tests passed!")
    
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())