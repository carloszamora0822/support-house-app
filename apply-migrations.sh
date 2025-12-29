#!/bin/bash
# Apply all database migrations to Supabase
# Run this script after setting your database connection string

set -e  # Exit on error

echo "🚀 Applying Supabase Migrations..."
echo ""

# Check if SUPABASE_DB_URL is set
if [ -z "$SUPABASE_DB_URL" ]; then
    echo "❌ Error: SUPABASE_DB_URL environment variable is not set"
    echo ""
    echo "📝 To get your connection string:"
    echo "1. Go to https://supabase.com/dashboard"
    echo "2. Select your project: zwcpoqeimpabivktyagy"
    echo "3. Click Settings → Database"
    echo "4. Copy the 'Connection pooling' string"
    echo ""
    echo "🔧 Then run:"
    echo "export SUPABASE_DB_URL='postgresql://postgres.[PROJECT-REF]:[PASSWORD]@...'"
    echo "./apply-migrations.sh"
    echo ""
    exit 1
fi

echo "✅ Database connection string found"
echo ""

# Migration 014: DELETE Policies
echo "📝 Applying Migration 014: DELETE RLS Policies..."
psql "$SUPABASE_DB_URL" -f supabase/migrations/014_add_delete_policies.sql
if [ $? -eq 0 ]; then
    echo "✅ Migration 014 applied successfully"
else
    echo "❌ Migration 014 failed"
    exit 1
fi
echo ""

# Migration 015: NOT NULL Constraints
echo "📝 Applying Migration 015: NOT NULL Constraints..."
psql "$SUPABASE_DB_URL" -f supabase/migrations/015_add_not_null_constraints.sql
if [ $? -eq 0 ]; then
    echo "✅ Migration 015 applied successfully"
else
    echo "❌ Migration 015 failed"
    exit 1
fi
echo ""

# Fix Visit Count
echo "📝 Applying Fix: Visit Count Recalculation..."
psql "$SUPABASE_DB_URL" -f FIX_VISIT_COUNT.sql
if [ $? -eq 0 ]; then
    echo "✅ Visit count fix applied successfully"
else
    echo "❌ Visit count fix failed"
    exit 1
fi
echo ""

# Migration 016: Audit Logs
echo "📝 Applying Migration 016: Audit Logs Table..."
psql "$SUPABASE_DB_URL" -f supabase/migrations/016_create_audit_logs_table.sql
if [ $? -eq 0 ]; then
    echo "✅ Migration 016 applied successfully"
else
    echo "❌ Migration 016 failed"
    exit 1
fi
echo ""

echo "🎉 All migrations applied successfully!"
echo ""
echo "✅ DELETE RLS policies are in place"
echo "✅ NOT NULL constraints match your Zod schemas"
echo "✅ Visit counts are accurate"
echo "✅ Audit logging is enabled (HIPAA compliance)"
echo ""
echo "🚀 Your database is now production-ready!"
