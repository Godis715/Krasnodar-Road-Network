export default function getRandomElements(arr, num) {
    const randomArr = arr
        .map(
            (_, i) => [Math.random(), i]
        )
        .sort(
            ([a], [b]) =>
                a > b
                    ? 1
                    : a < b
                        ? -1
                        : 0
        );

    return randomArr
        .slice(0, num)
        .map(
            ([_, i]) => arr[i]
        );
}
