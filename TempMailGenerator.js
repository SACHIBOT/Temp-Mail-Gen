const axios = require('axios');


class TempMailGenerator {
  constructor() {
    this.baseUrl = 'https://tempmail.email/api';
    this.email = null;
  }

  async getDomains() {
    try {
      const response = await axios.get(`${this.baseUrl}/domains.alternative.config.json`);
      return response.data.domains;
    } catch (error) {
      console.error(`Error getting domains: ${error.message}`);
      return [];
    }
  }

  async generateEmail() {
    const domains = await this.getDomains()
    const randomDomain = domains[Math.floor(Math.random() * domains.length)];
    const emailName = this.generateRandomString(30);
    this.email = `${emailName}${randomDomain}`;
    return this.email;
  }

  generateRandomString(length) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
  }

  async checkMessages(email) {
    try {
      const response = await axios.get(`${this.baseUrl}/emails?inbox=${email}`);      
      return response.data.data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return { messages: [] };
      } else {
        console.error(`Error checking messages: ${error.message}`);
        return { messages: [] };
      }
    }
  }

  async getContent(id) {
    try {
      const headers = {
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
     };
  
      const response = await axios.get(`${this.baseUrl}/emails/${id}`, { headers, responseType: 'document' });
      return response.data;
    } catch (error) {
      console.error(`Error getting content: ${error.message}`);
      return null;
    }
  }
}

module.exports = TempMailGenerator;