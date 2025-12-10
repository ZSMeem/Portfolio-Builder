const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';
let authToken = '';
let userId = '';
let portfolioId = '';
let projectId = '';

async function testAPI() {
  console.log(' Testing Portfolio Builder API...\n');

  try {
    // Test 1: User Registration
    console.log('1. Testing user registration...');
    const registerData = {
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      password: 'password123'
    };

    const registerResponse = await axios.post(`${BASE_URL}/auth/register`, registerData);
    console.log('Registration:', registerResponse.data);
    authToken = registerResponse.data.token; // Adjust based on response structure

    // Test 2: User Login
    console.log('\n2. Testing user login...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: registerData.email,
      password: registerData.password
    });
    console.log('Login:', loginResponse.data);
    authToken = loginResponse.data.token || loginResponse.data.accessToken;

    // Test 3: Get Current User
    console.log('\n3. Testing current user endpoint...');
    const meResponse = await axios.get(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('Current user:', meResponse.data);
    userId = meResponse.data._id || meResponse.data.id;

    // Test 4: Create Portfolio
    console.log('\n4. Testing portfolio creation...');
    const portfolioData = {
      title: 'My Developer Portfolio',
      description: 'A showcase of my work',
      bio: 'Full-stack developer specializing in modern web technologies',
      skills: ['JavaScript', 'React', 'Node.js', 'Next.js'],
      socialLinks: {
        github: 'https://github.com/testuser',
        linkedin: 'https://linkedin.com/in/testuser'
      }
    };

    const portfolioResponse = await axios.post(`${BASE_URL}/portfolios`, portfolioData, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('Portfolio created:', portfolioResponse.data);
    portfolioId = portfolioResponse.data._id || portfolioResponse.data.id;

    // Test 5: Create Project
    console.log('\n5. Testing project creation...');
    const projectData = {
      title: 'E-Commerce Website',
      description: 'A full-stack e-commerce solution',
      technologies: ['Next.js', 'MongoDB', 'Stripe'],
      category: 'web',
      featured: true,
      githubUrl: 'https://github.com/testuser/ecommerce',
      liveUrl: 'https://ecommerce-demo.vercel.app',
      portfolioId: portfolioId
    };

    const projectResponse = await axios.post(`${BASE_URL}/projects`, projectData, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('Project created:', projectResponse.data);
    projectId = projectResponse.data._id || projectResponse.data.id;

    // Test 6: Get All Portfolios
    console.log('\n6. Testing get all portfolios...');
    const portfoliosResponse = await axios.get(`${BASE_URL}/portfolios`);
    console.log('Portfolios retrieved:', portfoliosResponse.data.length, 'items');

    // Test 7: Get Single Portfolio
    console.log('\n7. Testing get single portfolio...');
    const singlePortfolioResponse = await axios.get(`${BASE_URL}/portfolios/${portfolioId}`);
    console.log('Single portfolio retrieved');

    // Test 8: Get All Projects
    console.log('\n8. Testing get all projects...');
    const projectsResponse = await axios.get(`${BASE_URL}/projects`);
    console.log('Projects retrieved:', projectsResponse.data.length, 'items');

    // Test 9: Update Project
    console.log('\n9. Testing project update...');
    const updateResponse = await axios.put(`${BASE_URL}/projects/${projectId}`, {
      title: 'Updated E-Commerce Website',
      featured: false
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('Project updated:', updateResponse.data);

    console.log('\n🎉 All API tests completed successfully!');

  } catch (error) {
    console.error('Test failed:', {
      message: error.response?.data?.message || error.message,
      status: error.response?.status,
      endpoint: error.config?.url
    });
  }
}

testAPI();