import unittest
import main

class TestExam(unittest.TestCase):

    def test_test1(self):
        self.assertEqual(main.test1(), 5)


if __name__ == '__main__':
    unittest.main()
