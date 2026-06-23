import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Use this instead of import.meta
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '../../database.json');

if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, JSON.stringify({
    users: [],
    resumes: [],
    analyses: []
  }, null, 2));
}

const readDB = () => {
  const data = fs.readFileSync(dbPath, 'utf-8');
  return JSON.parse(data);
};

const writeDB = (data: any) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

export const db = {
  users: {
    find: (query: any) => {
      const data = readDB();
      let results = data.users;
      if (query.email) {
        results = results.filter((u: any) => u.email === query.email);
      }
      if (query.id) {
        results = results.filter((u: any) => u.id === query.id);
      }
      return results;
    },
    findOne: (query: any) => {
      const data = readDB();
      return data.users.find((u: any) => {
        let match = true;
        if (query.email) match = match && u.email === query.email;
        if (query.id) match = match && u.id === query.id;
        return match;
      });
    },
    create: (user: any) => {
      const data = readDB();
      const newUser = { 
        id: Date.now().toString(), 
        ...user, 
        createdAt: new Date().toISOString() 
      };
      data.users.push(newUser);
      writeDB(data);
      return newUser;
    },
    findByIdAndUpdate: (id: string, updates: any) => {
      const data = readDB();
      const index = data.users.findIndex((u: any) => u.id === id);
      if (index !== -1) {
        data.users[index] = { ...data.users[index], ...updates };
        writeDB(data);
        return data.users[index];
      }
      return null;
    },
    findById: (id: string) => {
      const data = readDB();
      return data.users.find((u: any) => u.id === id);
    },
    findAll: () => {
      const data = readDB();
      return data.users;
    }
  },
  resumes: {
    create: (resume: any) => {
      const data = readDB();
      const newResume = { 
        id: Date.now().toString(), 
        ...resume, 
        createdAt: new Date().toISOString() 
      };
      data.resumes.push(newResume);
      writeDB(data);
      return newResume;
    },
    find: (query: any) => {
      const data = readDB();
      let results = data.resumes;
      if (query.userId) {
        results = results.filter((r: any) => r.userId === query.userId);
      }
      if (query.id) {
        results = results.filter((r: any) => r.id === query.id);
      }
      return results;
    },
    findOne: (query: any) => {
      const data = readDB();
      return data.resumes.find((r: any) => {
        let match = true;
        if (query.id) match = match && r.id === query.id;
        if (query.userId) match = match && r.userId === query.userId;
        return match;
      });
    },
    findByIdAndUpdate: (id: string, updates: any) => {
      const data = readDB();
      const index = data.resumes.findIndex((r: any) => r.id === id);
      if (index !== -1) {
        data.resumes[index] = { ...data.resumes[index], ...updates };
        writeDB(data);
        return data.resumes[index];
      }
      return null;
    },
    findByIdAndDelete: (id: string) => {
      const data = readDB();
      const index = data.resumes.findIndex((r: any) => r.id === id);
      if (index !== -1) {
        const deleted = data.resumes.splice(index, 1)[0];
        writeDB(data);
        return deleted;
      }
      return null;
    },
    findById: (id: string) => {
      const data = readDB();
      return data.resumes.find((r: any) => r.id === id);
    }
  },
  analyses: {
    create: (analysis: any) => {
      const data = readDB();
      const newAnalysis = { 
        id: Date.now().toString(), 
        ...analysis, 
        createdAt: new Date().toISOString() 
      };
      data.analyses.push(newAnalysis);
      writeDB(data);
      return newAnalysis;
    },
    find: (query: any) => {
      const data = readDB();
      let results = data.analyses;
      if (query.userId) {
        results = results.filter((a: any) => a.userId === query.userId);
      }
      if (query.resumeId) {
        results = results.filter((a: any) => a.resumeId === query.resumeId);
      }
      return results;
    },
    findOne: (query: any) => {
      const data = readDB();
      return data.analyses.find((a: any) => {
        let match = true;
        if (query.resumeId) match = match && a.resumeId === query.resumeId;
        if (query.id) match = match && a.id === query.id;
        return match;
      });
    },
    findById: (id: string) => {
      const data = readDB();
      return data.analyses.find((a: any) => a.id === id);
    }
  }
};

export const connectDB = async (): Promise<void> => {
  console.log('✅ JSON database connected successfully!');
  console.log('📁 Database file: database.json');
  console.log(`📊 Users: ${db.users.findAll().length}`);
  console.log(`📄 Resumes: ${db.resumes.find({}).length}`);
  console.log(`📈 Analyses: ${db.analyses.find({}).length}`);
};