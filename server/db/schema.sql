-- Admin Users Table
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'staff',
  permissions TEXT[],
  status VARCHAR(20) DEFAULT 'active',
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admin Activity Logs
CREATE TABLE admin_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES admin_users(id),
  action VARCHAR(255) NOT NULL,
  module VARCHAR(50),
  resource_id VARCHAR(255),
  changes JSONB,
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payment Webhooks Log
CREATE TABLE payment_webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference VARCHAR(100) UNIQUE NOT NULL,
  payment_status VARCHAR(50),
  amount DECIMAL(12, 2),
  payload JSONB NOT NULL,
  signature_valid BOOLEAN DEFAULT FALSE,
  processed BOOLEAN DEFAULT FALSE,
  processed_at TIMESTAMP,
  error_message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payment Transactions
CREATE TABLE payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id VARCHAR(100),
  reference VARCHAR(100) UNIQUE NOT NULL,
  transaction_id VARCHAR(255),
  amount DECIMAL(12, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'NGN',
  status VARCHAR(50) NOT NULL,
  payment_method VARCHAR(50),
  customer_email VARCHAR(255),
  webhook_id UUID REFERENCES payment_webhooks(id),
  retry_count INT DEFAULT 0,
  last_retry TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Refunds
CREATE TABLE refunds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id UUID REFERENCES payment_transactions(id),
  order_id VARCHAR(100),
  amount DECIMAL(12, 2) NOT NULL,
  reason VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending',
  refund_reference VARCHAR(100),
  processed_by UUID REFERENCES admin_users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Homepage Carousel
CREATE TABLE homepage_carousel (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255),
  image_url TEXT,
  link_url TEXT,
  linked_product_id INTEGER,
  background_color VARCHAR(7),
  text_color VARCHAR(7),
  position INT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  auto_slide BOOLEAN DEFAULT TRUE,
  slide_duration INT DEFAULT 5000,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Analytics Snapshots
CREATE TABLE analytics_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric VARCHAR(100) NOT NULL,
  value DECIMAL(15, 2),
  category VARCHAR(100),
  period VARCHAR(20),
  snapshot_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Featured Products
CREATE TABLE featured_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id INTEGER NOT NULL,
  position INT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admin Notifications
CREATE TABLE admin_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES admin_users(id),
  type VARCHAR(50),
  title VARCHAR(255),
  message TEXT,
  related_id VARCHAR(255),
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_admin_logs_admin_id ON admin_logs(admin_id);
CREATE INDEX idx_admin_logs_created ON admin_logs(created_at);
CREATE INDEX idx_payment_webhooks_reference ON payment_webhooks(reference);
CREATE INDEX idx_payment_webhooks_created ON payment_webhooks(created_at);
CREATE INDEX idx_payment_transactions_reference ON payment_transactions(reference);
CREATE INDEX idx_payment_transactions_status ON payment_transactions(status);
CREATE INDEX idx_refunds_status ON refunds(status);
CREATE INDEX idx_carousel_position ON homepage_carousel(position);
CREATE INDEX idx_featured_products_position ON featured_products(position);
CREATE INDEX idx_analytics_metric ON analytics_snapshots(metric, snapshot_date);
CREATE INDEX idx_admin_notifications_admin_id ON admin_notifications(admin_id);
