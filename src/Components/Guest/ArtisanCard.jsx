const ArtisanCard = ({ artisan, onToggleStatus, isSelf }) => {
  const {
    fullName,
    artisanData: { location, rating } = {},
    profileImage,
    status = 'available',
  } = artisan;

  return (
    <div className="bg-white shadow-md rounded-lg p-4 text-center">
      <img
        src={profileImage || '/default-avatar.png'}
        alt={fullName}
        className="w-24 h-24 rounded-full mx-auto mb-2 object-cover"
      />
      <h2 className="text-lg font-semibold">{fullName}</h2>
      <p className="text-sm text-gray-600">{location || 'No location set'}</p>
      <p className="text-sm text-yellow-500">⭐ {rating || 'N/A'}</p>

      {isSelf && (
        <button
          className={`mt-2 px-4 py-2 rounded ${
            status === 'available'
              ? 'bg-[#A1B7F2]'
              : 'bg-[#ECF1FC]'
          } text-white`}
          onClick={() => onToggleStatus(artisan)}
        >
          {status === 'available' ? 'Mark as Booked' : 'Mark as Available'}
        </button>
      )}
    </div>
  );
};

export default ArtisanCard;
