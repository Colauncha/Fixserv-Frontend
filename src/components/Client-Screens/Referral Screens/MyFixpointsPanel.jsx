import equivalent from "../../../assets/client images/client-home/referal part/equivalent.png";
import reward from "../../../assets/client images/client-home/referal part/reward.png";
import fixCoin from "../../../assets/client images/client-home/referal part/Fixcoin.png";

const MyFixpointsPanel = ({ fixpoints = 0 }) => {
  const rewardTarget = 1000;

  const progress = Math.min((fixpoints / rewardTarget) * 100, 100);

  const nairaValue = fixpoints * 2;

  const canRedeem = fixpoints >= rewardTarget;

  return (
    <div className="w-full max-w-5xl min-w-0">
      {/* Header */}
      <h3 className="text-lg font-semibold text-gray-900">My Fixpoints</h3>

      <p className="text-sm text-gray-500 mt-1 mb-6">
        Keep earning, you are getting closer to your next cash reward!
      </p>

      {/* Progress */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-xs text-gray-500 shrink-0">0pts</span>

        <div className="flex-1 h-[6px] bg-gray-200 rounded-full overflow-hidden min-w-0">
          <div
            className="h-full bg-blue-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <span className="text-xs text-gray-500 shrink-0">
          {rewardTarget}pts
        </span>
      </div>

      {/* Summary Wrapper */}
      <div className="border border-blue-200 rounded-xl bg-blue-50 p-4 mb-8">
        <div className="bg-white rounded-lg border border-gray-100 px-4 sm:px-5 py-4 space-y-4">
          <div className="flex justify-between items-center gap-4 text-sm">
            <span className="flex items-center gap-2 text-gray-600">
              <img src={fixCoin} className="w-4 h-4" alt="" />
              Total Fixpoints
            </span>

            <span className="font-semibold text-gray-800 text-right">
              {fixpoints} pts
            </span>
          </div>

          <div className="flex justify-between items-center gap-4 text-sm">
            <span className="flex items-center gap-2 text-gray-600">
              <img src={equivalent} className="w-4 h-4" alt="" />
              Equivalent values
            </span>

            <span className="font-semibold text-gray-800 text-right">
              ₦{nairaValue.toLocaleString()}.00
            </span>
          </div>

          <div className="flex justify-between items-center gap-4 text-sm">
            <span className="flex items-center gap-2 text-gray-600">
              <img src={reward} className="w-4 h-4" alt="" />
              Next Reward unlocks at
            </span>

            <span className="font-semibold text-gray-800 text-right">
              {rewardTarget} pts
            </span>
          </div>

          <button
            disabled={!canRedeem}
            className={`w-full text-sm py-2.5 rounded-md mt-2 ${
              canRedeem
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Redeem points
          </button>

          {!canRedeem && (
            <p className="text-xs text-center text-gray-400">
              Fixpoints can only be redeemed after reaching {rewardTarget} pts
            </p>
          )}
        </div>
      </div>

      {/* Activity Table Desktop */}
      <h4 className="text-sm font-semibold text-gray-800 mb-3">
        Fixpoint Activity
      </h4>

      <div className="border border-gray-200 rounded-lg overflow-hidden text-sm hidden md:block">
        <div className="grid grid-cols-5 bg-blue-50 px-4 py-2 text-gray-600 font-medium">
          <span>Date</span>
          <span>Activity</span>
          <span>Type</span>
          <span>Points</span>
          <span>Status</span>
        </div>

        <div className="px-4 py-6 text-gray-500 text-sm">
          Activity history will appear here once available.
        </div>
      </div>

      {/* Activity Mobile */}
      <div className="md:hidden border border-gray-200 rounded-lg p-4 text-sm text-gray-500">
        Activity history will appear here once available.
      </div>
    </div>
  );
};

export default MyFixpointsPanel;