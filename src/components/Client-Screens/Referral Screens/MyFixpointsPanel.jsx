import equivalent from "../../../assets/client images/client-home/referal part/equivalent.png";
import reward from "../../../assets/client images/client-home/referal part/reward.png";
import fixCoin from "../../../assets/client images/client-home/referal part/Fixcoin.png";

const MyFixpointsPanel = () => {
  return (
    <div className="max-w-5xl">

      {/* Header */}
      <h3 className="text-lg font-semibold text-gray-900">
        My Fixpoints
      </h3>
      <p className="text-sm text-gray-500 mt-1 mb-6">
        Keep earning, you are getting closer to your next cash reward!
      </p>

      {/* Progress */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-xs text-gray-500">0pts</span>

        <div className="flex-1 h-[6px] bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 w-[85%]" />
        </div>

        <span className="text-xs text-gray-500">1000pts</span>
      </div>

      {/* Summary Wrapper */}
      <div className="border border-blue-200 rounded-xl bg-blue-50 p-4 mb-8">

        {/* Inner Card */}
        <div className="bg-white rounded-lg border border-gray-100 px-5 py-4 space-y-4">

          <div className="flex justify-between items-center text-sm">
            <span className="flex items-center gap-2 text-gray-600">
              <img src={fixCoin} alt="" className="w-4 h-4" />
              Total Fixpoints
            </span>
            <span className="font-semibold text-gray-800">850 pts</span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="flex items-center gap-2 text-gray-600">
              <img src={equivalent} alt="" className="w-4 h-4" />
              Equivalent values
            </span>
            <span className="font-semibold text-gray-800">₦1700.00</span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="flex items-center gap-2 text-gray-600">
              <img src={reward} alt="" className="w-4 h-4" />
              Next Reward unlocks at
            </span>
            <span className="font-semibold text-gray-800">1000 pts</span>
          </div>

          <button
            disabled
            className="w-full bg-gray-300 text-gray-500 text-sm py-2.5 rounded-md cursor-not-allowed mt-2"
          >
            Redeem points
          </button>

          <p className="text-xs text-center text-gray-400">
            Fixpoints can only be redeemed after reaching 1000 pts
          </p>
        </div>
      </div>

      {/* Activity Table */}
      <h4 className="text-sm font-semibold text-gray-800 mb-3">
        Fixpoint Activity
      </h4>

      <div className="border border-gray-200 rounded-lg overflow-hidden text-sm">

        {/* Table Head */}
        <div className="grid grid-cols-5 bg-blue-50 px-4 py-2 text-gray-600 font-medium">
          <span>Date</span>
          <span>Activity</span>
          <span>Type</span>
          <span>Points</span>
          <span>Status</span>
        </div>

        {[
          ["7-11-2025","Sign-Up Bonus","Bonus","+200","Completed"],
          ["7-11-2025","Referral - Lawal Hassan","Referral","+150","Pending"],
          ["7-11-2025","Referral - John Adewale","Referral","+150","Pending"],
          ["7-11-2025","Referral - Tunde Hassan","Referral","+150","Completed"],
          ["7-11-2025","Verification Bonus","Task","+100","Completed"],
          ["7-11-2025","Booked A Repair","Task","+100","Completed"],
          ["7-11-2025","Referral - Ufoma Napoleon","Referral","+150","Completed"],
        ].map((row, i) => (
          <div
            key={i}
            className="grid grid-cols-5 px-4 py-3 border-t border-gray-100 text-gray-700"
          >
            <span>{row[0]}</span>
            <span>{row[1]}</span>
            <span>{row[2]}</span>

            <span className="text-green-600 font-medium">
              {row[3]}
            </span>

            <span>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  row[4] === "Completed"
                    ? "bg-green-100 text-green-600"
                    : "bg-yellow-100 text-yellow-600"
                }`}
              >
                {row[4]}
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyFixpointsPanel;
