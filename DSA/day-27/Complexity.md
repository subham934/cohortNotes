# Complexity — Complete Notes
### Data Structures & Algorithms

---

## 1. Complexity — Kya Hai?

Jab hum koi code likhte hain — toh hume yeh jaanna hota hai ki woh code **kitna fast** hai aur **kitna memory** use karta hai. Isi ko **Complexity** kehte hain.

Complexity 2 cheezein measure karta hai:
- **Time Complexity** — Code kitna time leta hai?
- **Space Complexity** — Code kitni memory use karta hai?

**Example se socho:**

Maan lo tumhare paas 1000 students ki list hai aur tumhe ek student dhundna hai.
- Ek ek karke dekho → Slow (1000 steps)
- Sorted list mein beech se check karo → Fast (10 steps)

Yahi Complexity ka concept hai — ek hi kaam, alag alag tarike, alag alag speed!

---

## 2. Time Complexity

Time Complexity matlab — **input badha toh code kitna zyada time lega?**

> ⚠️ NOTE: Actual seconds nahi measure karte — **STEPS count karte hain!**

---

### Example 1 — Single Loop

```javascript
for(let i = 0; i < n; i++) {
    console.log(i);
}
```

```
n = 5    → 5 steps
n = 100  → 100 steps
n = 1000 → 1000 steps
```

Input badhta hai toh steps bhi utna hi badhte hain → **O(n)**

---

### Example 2 — Double Loop (Nested)

```javascript
for(let i = 0; i < n; i++) {
    for(let j = 0; j < n; j++) {
        console.log(i, j);
    }
}
```

```
n = 5   → 5 × 5   = 25 steps
n = 100 → 100×100 = 10,000 steps
```

Nested loop matlab → **O(n²)** — bahut slow!

---

### Example 3 — No Loop

```javascript
function add(a, b) {
    return a + b;
}
```

n chahe kuch bhi ho → sirf 1 step → **O(1)** — Fastest!

---

## 3. Large Input Handle Karna

Competitive programming mein inputs bahut bade hote hain. Samajhna zaroori hai ki kaun sa code chalega aur kaun sa nahi.

| n ka size | Allowed Complexity | Example |
|---|---|---|
| n ≤ 10 | O(n!) ya O(2ⁿ) | Recursion, Brute Force |
| n ≤ 100 | O(n³) | Triple nested loop |
| n ≤ 1,000 | O(n²) | Double nested loop |
| n ≤ 100,000 | O(n log n) | Merge Sort, Binary Search |
| n ≤ 10,000,000 | O(n) | Single loop |
| n > 10,000,000 | O(log n) ya O(1) | Math formula, Hash |

**Real Example:**

Agar n = 100,000 aur tumhara code O(n²) hai:
```
100,000 × 100,000 = 10,000,000,000 steps → TLE aayega! ❌
```

Usi problem ke liye O(n log n) use karo:
```
100,000 × 17 ≈ 1,700,000 steps → Fast! ✅
```

---

## 4. Complexity Representation — Big O Notation

Big O Notation ek **standard tarika** hai complexity likhne ka. Yeh **worst case** batata hai.

| Notation | Naam | Matlab |
|---|---|---|
| O(1) | Constant | Input se koi fark nahi — hamesha 1 step |
| O(log n) | Logarithmic | Har step mein problem aadhi hoti hai |
| O(n) | Linear | Input jitna, utne steps |
| O(n log n) | Linearithmic | Thoda slow, par acceptable |
| O(n²) | Quadratic | Nested loop — slow for large n |
| O(2ⁿ) | Exponential | Bahut slow — sirf chhote n ke liye |
| O(n!) | Factorial | Worst — sirf n ≤ 10 ke liye |

### Big O Rules — Yaad Rakho

- Constants hata do → `O(3n) = O(n)`
- Sirf sabse bada term rakho → `O(n² + n) = O(n²)`
- Worst case socho hamesha

```javascript
for(let i = 0; i < n; i++) { ... }       // O(n)
for(let i = 0; i < n; i++) { ... }       // O(n)
// Total = O(n) + O(n) = O(2n) = O(n)   // Constants hata do!
```

---

## 5. Types and Graph

**Speed ka order — Fastest se Slowest:**

```
O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ) < O(n!)
```

| Complexity | n = 10 | n = 100 | n = 1000 | Speed |
|---|---|---|---|---|
| O(1) | 1 | 1 | 1 | ⚡ Fastest |
| O(log n) | 3 | 7 | 10 | 🚀 Very Fast |
| O(n) | 10 | 100 | 1,000 | ✅ Fast |
| O(n log n) | 30 | 700 | 10,000 | ✅ OK |
| O(n²) | 100 | 10,000 | 1,000,000 | ⚠️ Slow |
| O(2ⁿ) | 1,024 | ~10³⁰ | ~10³⁰⁰ | ❌ Very Slow |
| O(n!) | 3,628,800 | ~10¹⁵⁷ | Impossible | 💀 Worst |

### Real Life Examples

- **O(1)** → Array mein index se element access karna: `arr[5]`
- **O(log n)** → Dictionary mein word dhundna
- **O(n)** → List mein ek ek karke element dekhna
- **O(n²)** → Bubble Sort — har element ko baaki sab se compare karna
- **O(n log n)** → Merge Sort — divide and conquer

---

## 6. Complexity Equation Banana

Kisi bhi code ka complexity kaise nikaalein? — **3 simple steps!**

### Step 1 — Loops Count Karo
- 1 loop → O(n)
- Loop andar loop → O(n²)
- Loop andar loop andar loop → O(n³)

### Step 2 — Alag Alag Parts Add Karo

```javascript
for(let i = 0; i < n; i++) { }   // O(n)
for(let i = 0; i < n; i++) { }   // O(n)
// Total = O(n) + O(n) = O(n)
```

### Step 3 — Sirf Bada Term Rakho

```javascript
O(n² + n + 1) → O(n²)      // n² sabse bada hai
O(n log n + n) → O(n log n)
```

---

### Practice Examples

**Example A:**
```javascript
for(let i = 0; i < n; i++) {         // O(n)
    for(let j = 0; j < n; j++) {     // O(n)
        console.log(i + j);          // O(1)
    }
}
// Complexity = O(n) × O(n) = O(n²)
```

**Example B:**
```javascript
for(let i = 1; i < n; i = i * 2) {  // Har step mein i double hota hai
    console.log(i);
}
// n = 8 → i: 1, 2, 4, 8 → sirf 3 steps = log₂(8)
// Complexity = O(log n)
```

**Example C — Binary Search:**
```javascript
function binarySearch(arr, target) {
    let left = 0, right = arr.length;
    while(left <= right) {
        let mid = Math.floor((left + right) / 2);
        if(arr[mid] === target) return mid;
        else if(arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
}
// Complexity = O(log n)
```

---

## 7. TLE — Time Limit Exceeded

TLE matlab tumhara code **itna slow hai** ki allowed time mein finish nahi hua.

### TLE Kyun Aata Hai?
- Wrong complexity use ki — O(n²) ki jagah chahiye tha O(n)
- Unnecessary loops likhe
- Recursion mein memoization nahi use ki

### TLE Se Bachne Ka Tarika

| Problem | TLE wala code | Fix |
|---|---|---|
| Array mein element dhundna | Linear search O(n) | Binary search O(log n) |
| Sorting | Bubble sort O(n²) | Merge/Quick sort O(n log n) |
| Repeated subproblems | Plain recursion O(2ⁿ) | DP/Memoization O(n) |
| Sum of subarray | Nested loop O(n²) | Prefix sum O(n) |

### TLE Example:

```javascript
// ❌ TLE — O(n²)
for(let i = 0; i < n; i++) {
    for(let j = 0; j < n; j++) {
        if(arr[i] + arr[j] === target) return true;
    }
}

// ✅ Fast — O(n)
let set = new Set();
for(let i = 0; i < n; i++) {
    if(set.has(target - arr[i])) return true;
    set.add(arr[i]);
}
```

---

## 8. Space Complexity

Space Complexity matlab — code **kitni extra memory** use karta hai?

> ⚠️ Input ki memory count nahi hoti — sirf **extra memory** count hoti hai!

| Code | Space Complexity | Kyun? |
|---|---|---|
| `let x = 5;` | O(1) | Sirf 1 variable |
| `let arr = new Array(n)` | O(n) | n size ka array |
| `let matrix = new Array(n×n)` | O(n²) | n×n matrix |
| Recursive function (depth n) | O(n) | Call stack mein n frames |

### O(1) Space — Constant

```javascript
function sum(arr) {
    let total = 0;              // sirf 1 variable
    for(let i = 0; i < arr.length; i++) {
        total += arr[i];
    }
    return total;
}
// Extra memory = sirf 'total' variable = O(1)
```

### O(n) Space — Linear

```javascript
function copyArray(arr) {
    let newArr = [];            // n size ka array
    for(let i = 0; i < arr.length; i++) {
        newArr.push(arr[i]);
    }
    return newArr;
}
// Extra memory = newArr (n size) = O(n)
```

### Recursion — O(n) Space

```javascript
function factorial(n) {
    if(n === 1) return 1;
    return n * factorial(n-1);  // n baar call hoga
}
// Call stack mein n frames bante hain = O(n) space
```

### Time vs Space Tradeoff

Kabhi kabhi hum **zyada memory** use karke **time bachate** hain!
- HashMap use karo → Time O(1), Space O(n)
- DP array use karo → Time O(n), Space O(n) — recursion se fast

---

## 9. Practice Questions

---

**Q1. Neeche diye code ka complexity kya hai?**

```javascript
for(let i = 0; i < n; i++) {
    for(let j = i; j < n; j++) {
        console.log(i, j);
    }
}
```

> ✅ Answer: **O(n²)** — inner loop n-i baar chalta hai but worst case O(n²)

---

**Q2. Binary Search ka complexity?**

```
Sorted array: [1, 3, 5, 7, 9, 11, 13, 15]
Target: 7
```

> ✅ Answer: **O(log n)** — har step mein array aadha hota hai
> Steps: 8 → 4 → 2 → 1 = 3 steps = log₂(8)

---

**Q3. Is code ka space complexity kya hai?**
 
```javascript
function reverse(arr) {
    let result = [];
    for(let i = arr.length-1; i >= 0; i--) {
        result.push(arr[i]);
    }
    return result;
}
```

> ✅ Answer: **O(n)** — result array n size ka hai

---

**Q4. Yeh code TLE dega? (n = 100,000)**

```javascript
for(let i = 0; i < n; i++) {
    for(let j = 0; j < n; j++) {
        sum += arr[i][j];
    }
}
```

> ❌ Answer: **Haan! TLE aayega**
> 100,000 × 100,000 = 10¹⁰ steps — bahut zyada!

---

**Q5. Fibonacci ka complexity — plain recursion vs DP?**

```javascript
// Plain Recursion
function fib(n) { return fib(n-1) + fib(n-2); }  // O(2ⁿ) ❌

// DP (Memoization)
let memo = {};
function fib(n) {
    if(memo[n]) return memo[n];
    return memo[n] = fib(n-1) + fib(n-2);         // O(n) ✅
}
```

> Plain recursion = **O(2ⁿ)** — TLE ❌
> DP = **O(n)** — Fast! ✅

---

## Quick Summary — Sab Ek Jagah

| Topic | Key Point |
|---|---|
| Complexity | Code ki speed aur memory measure karna |
| Time Complexity | Steps count karna — actual seconds nahi |
| Large Input | n ke size ke hisaab se complexity choose karo |
| Big O | Worst case representation — O(1), O(n), O(n²)... |
| Types | O(1) fastest, O(n!) slowest |
| Equation | Constants hatao, sirf bada term rakho |
| TLE | Code time limit mein finish nahi hua — optimize karo |
| Space | Extra memory use — O(1) best, O(n²) avoid karo |

---

> **Best of luck! 🚀**