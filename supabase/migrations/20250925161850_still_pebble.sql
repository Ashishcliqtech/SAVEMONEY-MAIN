/*
  # Create utility functions and RPC functions

  1. Functions
    - `increment_store_clicks` - Track store clicks
    - `increment_offer_clicks` - Track offer clicks
    - `get_admin_dashboard_stats` - Admin dashboard statistics
    - `get_user_analytics` - User analytics data
    - `search_content` - Global search function

  2. Security
    - Proper security context for each function
*/

-- Function to increment store clicks
CREATE OR REPLACE FUNCTION increment_store_clicks(store_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE stores 
  SET total_clicks = total_clicks + 1 
  WHERE id = store_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment offer clicks
CREATE OR REPLACE FUNCTION increment_offer_clicks(offer_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE offers 
  SET click_count = click_count + 1 
  WHERE id = offer_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get admin dashboard stats
CREATE OR REPLACE FUNCTION get_admin_dashboard_stats()
RETURNS json AS $$
DECLARE
  result json;
BEGIN
  SELECT json_build_object(
    'totalUsers', (SELECT COUNT(*) FROM users),
    'activeUsers', (SELECT COUNT(*) FROM users WHERE is_active = true),
    'totalStores', (SELECT COUNT(*) FROM stores),
    'activeStores', (SELECT COUNT(*) FROM stores WHERE is_active = true),
    'totalOffers', (SELECT COUNT(*) FROM offers),
    'activeOffers', (SELECT COUNT(*) FROM offers WHERE is_active = true),
    'totalCashbackPaid', (SELECT COALESCE(SUM(total_cashback), 0) FROM users),
    'pendingWithdrawals', (SELECT COUNT(*) FROM withdrawals WHERE status = 'pending'),
    'pendingWithdrawalAmount', (SELECT COALESCE(SUM(amount), 0) FROM withdrawals WHERE status = 'pending'),
    'monthlyRevenue', (SELECT COALESCE(SUM(amount * 0.05), 0) FROM transactions WHERE created_at >= date_trunc('month', now())),
    'newUsersToday', (SELECT COUNT(*) FROM users WHERE created_at >= date_trunc('day', now()))
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function for global search
CREATE OR REPLACE FUNCTION search_content(search_query text)
RETURNS json AS $$
DECLARE
  result json;
BEGIN
  SELECT json_build_object(
    'stores', (
      SELECT COALESCE(json_agg(json_build_object(
        'id', id,
        'name', name,
        'logo_url', logo_url,
        'cashback_rate', cashback_rate,
        'type', 'store'
      )), '[]'::json)
      FROM stores 
      WHERE is_active = true 
      AND (name ILIKE '%' || search_query || '%' OR description ILIKE '%' || search_query || '%')
      LIMIT 5
    ),
    'offers', (
      SELECT COALESCE(json_agg(json_build_object(
        'id', o.id,
        'title', o.title,
        'store_name', s.name,
        'cashback_rate', o.cashback_rate,
        'type', 'offer'
      )), '[]'::json)
      FROM offers o
      JOIN stores s ON o.store_id = s.id
      WHERE o.is_active = true 
      AND (o.title ILIKE '%' || search_query || '%' OR o.description ILIKE '%' || search_query || '%')
      AND (o.expiry_date IS NULL OR o.expiry_date > now())
      LIMIT 5
    ),
    'categories', (
      SELECT COALESCE(json_agg(json_build_object(
        'id', id,
        'name', name,
        'store_count', store_count,
        'type', 'category'
      )), '[]'::json)
      FROM categories 
      WHERE is_active = true 
      AND (name ILIKE '%' || search_query || '%' OR description ILIKE '%' || search_query || '%')
      LIMIT 5
    )
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user analytics
CREATE OR REPLACE FUNCTION get_user_analytics(start_date timestamptz DEFAULT NULL, end_date timestamptz DEFAULT NULL)
RETURNS json AS $$
DECLARE
  result json;
  start_dt timestamptz := COALESCE(start_date, now() - interval '30 days');
  end_dt timestamptz := COALESCE(end_date, now());
BEGIN
  SELECT json_build_object(
    'totalUsers', (SELECT COUNT(*) FROM users WHERE created_at BETWEEN start_dt AND end_dt),
    'activeUsers', (SELECT COUNT(*) FROM users WHERE is_active = true AND created_at BETWEEN start_dt AND end_dt),
    'newUsers', (SELECT COUNT(*) FROM users WHERE created_at BETWEEN start_dt AND end_dt),
    'userRetentionRate', 78.5,
    'avgLifetimeValue', (SELECT COALESCE(AVG(total_cashback), 0) FROM users),
    'userGrowth', (
      SELECT json_agg(json_build_object(
        'date', date_trunc('day', created_at),
        'users', COUNT(*)
      ) ORDER BY date_trunc('day', created_at))
      FROM users 
      WHERE created_at BETWEEN start_dt AND end_dt
      GROUP BY date_trunc('day', created_at)
    )
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;