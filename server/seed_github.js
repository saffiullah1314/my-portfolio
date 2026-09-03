const mongoose = require('mongoose');
require('dotenv').config({ path: __dirname + '/.env' });
const Project = require('./models/Project');

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to DB');

  const existingProjects = await Project.find();
  const existingNames = existingProjects.map(p => p.title.toLowerCase());
  const existingGithub = existingProjects.map(p => p.github?.toLowerCase()).filter(Boolean);

  const res = await fetch('https://api.github.com/users/saffiullah1314/repos?sort=updated&per_page=100');
  const repos = await res.json();

  let added = 0;
  for (const repo of repos) {
    if (repo.fork) continue; // skip forks
    // filter important ones: skip simple test repos or no description ones unless it has topics
    if (!repo.description && repo.topics.length === 0) continue; 
    
    // Check if exists
    if (existingNames.includes(repo.name.toLowerCase()) || 
        (repo.html_url && existingGithub.includes(repo.html_url.toLowerCase()))) {
      console.log(`Skipping ${repo.name}, already exists.`);
      continue;
    }

    // Determine category based on topics or language
    let category = 'other';
    if (repo.topics.includes('machine-learning') || repo.language === 'Python' || repo.language === 'Jupyter Notebook') {
      category = 'machine learning';
    } else if (repo.topics.includes('react') || repo.topics.includes('web') || repo.language === 'JavaScript' || repo.language === 'TypeScript' || repo.language === 'HTML') {
      category = 'web app';
    } else if (repo.language === 'C++') {
      category = 'c++';
    }

    const p = new Project({
      title: repo.name.replace(/-/g, ' ').replace(/_/g, ' '),
      description: repo.description || 'GitHub Project',
      tags: repo.topics.length > 0 ? repo.topics : (repo.language ? [repo.language] : []),
      category: category,
      github: repo.html_url,
      webapp: repo.homepage || '',
      image: '', // Needs to be uploaded manually later
      visible: true,
      featured: repo.stargazers_count > 0,
    });

    await p.save();
    console.log(`Added ${repo.name}`);
    added++;
  }

  console.log(`Finished. Added ${added} projects.`);
  process.exit(0);
}

seed().catch(console.error);
