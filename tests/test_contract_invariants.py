from pathlib import Path


SOURCE = (Path(__file__).parents[1] / "contracts" / "gsource.py").read_text(encoding="utf-8")


def test_terminal_verdicts_are_explicit():
    for value in ("accurate", "misleading", "not_found", "undetermined"):
        assert value in SOURCE
    assert 'record["status"] = "rejected_misleading"' in SOURCE
    assert 'record["status"] = "rejected_not_found"' in SOURCE


def test_challenge_and_duplicate_guards_exist():
    assert "CHALLENGE_SECONDS = 5 * 60" in SOURCE
    assert 'record["challenge_deadline"]' in SOURCE
    assert "duplicate counter-context" in SOURCE
    assert "cannot add counter-context" in SOURCE


def test_every_terminal_path_zeroes_bond():
    assert SOURCE.count('self.bonds[key] = "0"') >= 2
    assert '"protocol_retained": "0"' in SOURCE
    assert '"paid_to_submitter": "0"' in SOURCE
    assert '"paid_to_challenger": "0"' in SOURCE


def test_consensus_is_bounded_and_abstains():
    assert "prompt_comparative" in SOURCE
    assert '["accurate", "misleading", "not_found", "undetermined"]' in SOURCE
    assert "challenger_materially_supports" in SOURCE
