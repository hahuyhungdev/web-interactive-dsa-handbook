import unittest
from group_anagrams import Solution

class TestGroupAnagrams(unittest.TestCase):
    def test_group_anagrams_1(self):
        s = Solution()
        strs = ["eat","tea","tan","ate","nat","bat"]
        expected = [["eat","tea","ate"],["tan","nat"],["bat"]]
        result = s.groupAnagrams(strs)
        
        # Sort internal lists and the outer list to compare
        result_sorted = sorted([sorted(x) for x in result])
        expected_sorted = sorted([sorted(x) for x in expected])
        
        self.assertEqual(result_sorted, expected_sorted)

    def test_group_anagrams_2(self):
        s = Solution()
        strs = [""]
        expected = [[""]]
        self.assertEqual(s.groupAnagrams(strs), expected)

    def test_group_anagrams_3(self):
        s = Solution()
        strs = ["a"]
        expected = [["a"]]
        self.assertEqual(s.groupAnagrams(strs), expected)

if __name__ == '__main__':
    unittest.main()
