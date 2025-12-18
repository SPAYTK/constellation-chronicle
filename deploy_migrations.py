#!/usr/bin/env python3
"""
Deploy Supabase migrations using REST API
"""
import json
import requests
import sys
from pathlib import Path

# Configuration
SUPABASE_URL = "https://cadavbabblukuabioekc.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhZGF2YmFiYmx1a3VhYmlvZWtjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3OTc3MDksImV4cCI6MjA4MTM3MzcwOX0.HOVGnZDLUx-taLUe_rqYf7Z-cRUmDFj783SIPLvkECk"
MIGRATIONS_DIR = Path("/workspaces/constellation-chronicle/supabase/migrations")

headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
}

def execute_sql(sql: str) -> bool:
    """Execute SQL via Supabase REST API"""
    # Escape newlines and quotes in SQL
    sql_escaped = sql.replace('"', '\\"').replace('\n', ' ')
    
    payload = {
        "query": sql
    }
    
    try:
        response = requests.post(
            f"{SUPABASE_URL}/rest/v1/rpc/exec_sql",
            json=payload,
            headers=headers,
            timeout=30
        )
        print(f"Status: {response.status_code}")
        if response.status_code >= 400:
            print(f"Error: {response.text}")
            return False
        print(f"Response: {response.text[:200]}")
        return True
    except Exception as e:
        print(f"Exception: {e}")
        return False

def main():
    """Deploy all migrations"""
    migrations = sorted(MIGRATIONS_DIR.glob("*.sql"))
    
    if not migrations:
        print("❌ No migrations found")
        return False
    
    print(f"📁 Found {len(migrations)} migrations:")
    for m in migrations:
        print(f"   - {m.name}")
    
    print("\n🚀 Deploying migrations...")
    
    all_success = True
    for migration_file in migrations:
        print(f"\n📄 Executing {migration_file.name}...")
        
        sql = migration_file.read_text()
        
        # For large migrations, split by statements
        # This is a simple approach - may need refinement
        if execute_sql(sql):
            print(f"   ✅ Success")
        else:
            print(f"   ❌ Failed")
            all_success = False
    
    if all_success:
        print("\n✅ All migrations deployed successfully!")
        return True
    else:
        print("\n⚠️  Some migrations failed")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
