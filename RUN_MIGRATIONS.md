# 🚀 Run Database Migrations via CLI

Since you have `psql` installed, you can run all migrations at once using the command line!

---

## 📋 Step 1: Get Your Database Connection String

1. **Go to Supabase Dashboard:**
   - https://supabase.com/dashboard/project/zwcpoqeimpabivktyagy

2. **Navigate to Database Settings:**
   - Click **Settings** (⚙️ gear icon in sidebar)
   - Click **Database**
   - Scroll down to **Connection string** section

3. **Copy the Connection Pooling String:**
   - Select **Connection pooling** tab
   - Copy the string that looks like:
   ```
   postgresql://postgres.zwcpoqeimpabivktyagy:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
   ```
   - **Important:** Replace `[YOUR-PASSWORD]` with your actual database password

---

## 🔧 Step 2: Set Environment Variable

In your terminal, run:

```bash
export SUPABASE_DB_URL="postgresql://postgres.zwcpoqeimpabivktyagy:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres"
```

**Replace `[YOUR-PASSWORD]`** with your actual password!

---

## 🎯 Step 3: Run the Migration Script

```bash
cd /Users/carloszamora/Desktop/support-house-app
./apply-migrations.sh
```

This will automatically apply:
1. ✅ Migration 014 - DELETE RLS Policies
2. ✅ Migration 015 - NOT NULL Constraints
3. ✅ FIX_VISIT_COUNT.sql - Fix visit counts
4. ✅ Migration 016 - Audit Logs Table

---

## 🎉 Done!

You should see:
```
🚀 Applying Supabase Migrations...
✅ Database connection string found
📝 Applying Migration 014: DELETE RLS Policies...
✅ Migration 014 applied successfully
📝 Applying Migration 015: NOT NULL Constraints...
✅ Migration 015 applied successfully
📝 Applying Fix: Visit Count Recalculation...
✅ Visit count fix applied successfully
📝 Applying Migration 016: Audit Logs Table...
✅ Migration 016 applied successfully
🎉 All migrations applied successfully!
```

---

## ⚠️ If You Don't Want to Use Terminal

You can still use the **Supabase Dashboard** method:
- See `APPLY_MIGRATIONS.md` for step-by-step dashboard instructions
- Just copy/paste the SQL into the SQL Editor

---

## 🔒 Security Note

**Never commit your database password to Git!**
- The connection string with password should only be in your terminal session
- It's not stored in any file
- The `export` command only sets it temporarily

---

## 🆘 Troubleshooting

**"command not found: psql"**
- Install PostgreSQL: `brew install postgresql`

**"connection refused"**
- Check your connection string is correct
- Verify your password is correct
- Make sure you're using the Connection Pooling string (port 6543)

**"permission denied"**
- Run: `chmod +x apply-migrations.sh`

**"SUPABASE_DB_URL not set"**
- Make sure you ran the `export` command in the same terminal window
- Check for typos in the connection string
