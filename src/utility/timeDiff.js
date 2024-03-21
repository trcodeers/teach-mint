function getTimeDifference(startTimeStamp, endTimeStamp) {
    // Convert timestamps to milliseconds
    const startTime = new Date(startTimeStamp).getTime();
    const endTime = new Date(endTimeStamp).getTime();

    // Calculate the difference in milliseconds
    let timeDifference = endTime - startTime;

    // Calculate minutes and seconds
    const minutes = Math.floor(timeDifference / (1000 * 60));
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

    return { minutes, seconds };
}

export default getTimeDifference;
