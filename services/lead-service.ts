const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

export const leadsService = {
 
  async fetchDataThroughBaseUrl(BASEURL:any,endpoint: string) {
    console.log(BASEURL,'BASEURLBASEURL')
    try {
      const response = await fetch(`${BASEURL}${endpoint}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      return { error: `Failed to fetch ${endpoint}` };
    }
  },
 
  // Lead-related API functions
  async getLeads() {
    return this.fetchDataThroughBaseUrl(API_BASE_URL,"/account");
  }
};
