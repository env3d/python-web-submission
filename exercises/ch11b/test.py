import unittest
from main import *

# Add imports here
from unittest.mock import mock_open, MagicMock, patch


class UnitTests(unittest.TestCase):

  def test_get_first_10_names(self):
      # Enter code here
      fake_titles = '\n'.join(
        ["1 name 3 4 0 6 7 8 Romance,abc"]*10 + ["1 2 3 4 1 6 7 8 abc,Romance"]*5 + ["t1 t2 t3 t4 t5 t6 t7 t8 t9"] + ["1 2 3 4 1 6 7 8 abc"]*5
      )  
      with patch("builtins.open", mock_open(read_data=fake_titles)):
        names = get_first_10_names()
        assert names == ["name"]*10

  def test_find_actor(self):
      # Enter code here
      fake_titles = '\n'.join(
        ["1 name 3 4 0 6 7 8 Romance,abc"]*10 + ["1 2 3 4 1 6 7 8 abc,Romance"]*5 + ["t1 t2 t3 t4 t5 t6 t7 t8 t9"] + ["1 2 3 4 1 6 7 8 abc"]*5
      )  
      with patch("builtins.open", mock_open(read_data=fake_titles)):
        line = find_actor('t2')
        assert line == "t1 t2 t3 t4 t5 t6 t7 t8 t9\n", line

  def test_count_actors_born_after(self):
      # Enter code here
      fake_titles = '\n'.join(
        ["1 name 3 4 0 6 7 8 Romance,abc"]*10 + ["1 2 3 4 1 6 7 8 abc,Romance"]*5 + ["t1 t2 4 t4 t5 t6 t7 t8 t9"] + ["1 2 3 4 1 6 7 8 abc"]*5
      )  
      with patch("builtins.open", mock_open(read_data=fake_titles)):
        c = count_actors_born_after(3)
        assert c == 1

  def test_count_dead_actors(self):
      # Enter code here
      fake_titles = '\n'.join(
        ["1 name 3 4 0 6 7 8 Romance,abc"]*10 + ["1 2 3 4 1 6 7 8 abc,Romance"]*5 + ["t1 t2 4 4 t5 t6 t7 t8 t9"] + ["1 2 3 \\N 1 6 7 8 abc"]*5
      )  
      with patch("builtins.open", mock_open(read_data=fake_titles)):
        c = count_dead_actors()
        assert c == 16, c

  def test_find_youngest_actor(self):
      # Enter code here
      fake_titles = '\n'.join(
        ["1 name 3 4 0 6 7 8 Romance,abc"]*10 + ["1 2 3 4 1 6 7 8 abc,Romance"]*5 + ["t1 t2 55 4 t5 t6 t7 t8 t9"] + ["1 2 3 \\N 1 6 7 8 abc"]*5
      )  
      with patch("builtins.open", mock_open(read_data=fake_titles)):
        actor = find_youngest_actor()
        assert actor == "t2"

