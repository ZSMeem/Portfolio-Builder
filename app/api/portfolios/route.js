import { authenticate } from '@/lib/auth';
import { query } from '@/lib/db';

export async function GET(request) {
  const user = await authenticate(request);

  if (!user) {
    return Response.json(
      { message: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const portfolios = await query(
      `SELECT id, title, description, personal_info, social_links, 
              skills, theme, is_published, custom_domain, created_at, updated_at
       FROM portfolios WHERE user_id = ?`,
      [user.id]
    );

    // Parse JSON fields
    const parsedPortfolios = portfolios.map(portfolio => ({
      ...portfolio,
      personal_info: portfolio.personal_info ? JSON.parse(portfolio.personal_info) : null,
      social_links: portfolio.social_links ? JSON.parse(portfolio.social_links) : null,
      skills: portfolio.skills ? JSON.parse(portfolio.skills) : [],
    }));

    return Response.json(parsedPortfolios);
  } catch (error) {
    console.error('Get portfolios error:', error);
    return Response.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  const user = await authenticate(request);

  if (!user) {
    return Response.json(
      { message: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const {
      title,
      description,
      personal_info,
      social_links,
      skills,
      theme = 'default'
    } = body;

    const result = await query(
      `INSERT INTO portfolios 
       (user_id, title, description, personal_info, social_links, skills, theme) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        user.id,
        title,
        description,
        JSON.stringify(personal_info || {}),
        JSON.stringify(social_links || {}),
        JSON.stringify(skills || []),
        theme
      ]
    );

    const [newPortfolio] = await query(
      'SELECT * FROM portfolios WHERE id = ?',
      [result.insertId]
    );

    // Parse JSON fields
    const parsedPortfolio = {
      ...newPortfolio,
      personal_info: newPortfolio.personal_info ? JSON.parse(newPortfolio.personal_info) : null,
      social_links: newPortfolio.social_links ? JSON.parse(newPortfolio.social_links) : null,
      skills: newPortfolio.skills ? JSON.parse(newPortfolio.skills) : [],
    };

    return Response.json(parsedPortfolio, { status: 201 });
  } catch (error) {
    console.error('Create portfolio error:', error);
    return Response.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}