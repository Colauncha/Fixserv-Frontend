import React from 'react'

const CharProfilePic = ({username, size, otherStyles = '', onClick = null}) => {

  return (
    <div 
      className={`${size ? `h-${size} w-${size}` : 'w-12 h-12'} bg-gradient-to-br from-blue-300 to-purple-300 text-white rounded-full flex items-center justify-center font-semibold text-lg ${otherStyles}`}
      onClick={onClick}
    >
      {username?.charAt(0) || 'A'}
    </div>
  )
}

export default CharProfilePic