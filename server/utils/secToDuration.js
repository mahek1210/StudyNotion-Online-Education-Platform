function convertSecondsToDuration(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = Math.floor((totalSeconds % 3600) % 60)

  if (hours > 0) {
    return `${hours}h ${minutes}m`
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`
  } else {
    return `${seconds}s`
  }
}

module.exports = {
  convertSecondsToDuration,
}

// helper to convert seconds to duration
// example: 3600 -> 1h 0m 0s
// example: 3661 => 1h 1m 1s
