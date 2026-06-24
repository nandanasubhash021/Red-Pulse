/**
 * Calculates dynamic cooling properties and outputs the exact Dashboard Display text.
 * @param {Object} user - The MongoDB User Document
 * @returns {Object} { statusText: string, isEligible: boolean }
 */
const calculateDonorStatus = (user) => {
  // 1. Evaluate Explicit Unavailability first
  if (!user.isAvailable) {
    if (user.healthStatus === 'Temporarily Unavailable') {
      return { statusText: 'Temporarily Unavailable', isEligible: false };
    }
    return { statusText: 'Medical Restriction', isEligible: false };
  }

  // 2. If the user has never donated, they are immediately eligible
  if (!user.lastDonationDate) {
    return { statusText: 'Eligible to Donate', isEligible: true };
  }

  // 3. Evaluate the Cooling Period
  const lastDate = new Date(user.lastDonationDate);
  const today = new Date();
  
  // Calculate difference in days
  const diffTime = today - lastDate;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  // Rule matrix: Male = 90 days, Female = 120 days
  const coolingPeriodRequired = user.gender === 'male' ? 90 : 120;

  if (diffDays >= 0 && diffDays < coolingPeriodRequired) {
    const daysRemaining = coolingPeriodRequired - diffDays;
    return { 
      statusText: `Cooling Period (${daysRemaining} days remaining)`, 
      isEligible: false 
    };
  }

  return { statusText: 'Eligible to Donate', isEligible: true };
};

module.exports = { calculateDonorStatus };