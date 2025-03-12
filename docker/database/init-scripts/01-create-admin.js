// This script creates an admin user if one doesn't exist
db = db.getSiblingDB('kirppis');

// Check if admin user exists
const adminExists = db.users.findOne({ email: process.env.ADMIN_EMAIL || 'admin@example.com' });

if (!adminExists) {
  // Create admin user
  db.users.insertOne({
    name: 'Admin',
    email: process.env.ADMIN_EMAIL || 'admin@example.com',
    // Note: In a real application, you would hash this password
    // This is just for initial setup and should be changed immediately
    password: process.env.ADMIN_PASSWORD || 'Admin123!',
    role: 'admin',
    createdAt: new Date(),
    updatedAt: new Date()
  });
  
  print('Admin user created successfully');
} else {
  print('Admin user already exists');
}

// Create default categories if they don't exist
const categories = [
  { name: 'Electronics', description: 'Electronic devices and gadgets' },
  { name: 'Furniture', description: 'Home and office furniture' },
  { name: 'Clothing', description: 'Clothes, shoes, and accessories' },
  { name: 'Books', description: 'Books, magazines, and literature' },
  { name: 'Sports', description: 'Sports equipment and gear' },
  { name: 'Toys', description: 'Toys and games for all ages' },
  { name: 'Home Appliances', description: 'Kitchen and home appliances' },
  { name: 'Other', description: 'Miscellaneous items' }
];

// Insert categories if they don't exist
categories.forEach(category => {
  const exists = db.categories.findOne({ name: category.name });
  if (!exists) {
    db.categories.insertOne({
      ...category,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    print(`Category '${category.name}' created successfully`);
  } else {
    print(`Category '${category.name}' already exists`);
  }
}); 