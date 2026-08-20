import hashlib
import json
from pathlib import Path
from unittest.mock import patch

import pytest
from gltest.direct import VMContext, create_test_addresses, deploy_contract

CONTRACT = Path(__file__).parents[2] / "contracts" / "gsource.py"
SUBMITTER, READER = create_test_addresses(2)
PRIMARY = "https://evidence.test/primary"
CONTEXT = "https://evidence.test/context"
PRIMARY_BODY = "GSource source evidence"
CONTEXT_BODY = "Independent context evidence"

def digest(body: str) -> str:
    return "0x" + hashlib.sha256(body.encode()).hexdigest()

def create(vm, contract):
    vm.sender, vm.value = SUBMITTER, 10**16
    return contract.create_check("A verified quote", PRIMARY, digest(PRIMARY_BODY), "GSource", "A faithful claim", "Test record")

def ready(vm):
    vm.warp("2026-01-01T00:06:00Z")
    import genlayer
    genlayer.gl.message_raw["datetime"] = "2026-01-01T00:06:00Z"

def deploy(vm):
    import os
    original_unlink = os.unlink
    def windows_safe_unlink(path, *args, **kwargs):
        try: return original_unlink(path, *args, **kwargs)
        except PermissionError: return None
    with patch("os.unlink", windows_safe_unlink):
        return deploy_contract(CONTRACT, vm)

def verdict(vm, contract, result):
    vm.mock_web(PRIMARY, {"method": "GET", "status": 200, "body": PRIMARY_BODY})
    vm.mock_llm("Fetched web pages", json.dumps(result))
    ready(vm)
    return contract.request_verdict(0)

def test_creation_validation_and_deadline_execute_in_vm():
    vm = VMContext(); vm.sender = SUBMITTER; vm.warp("2026-01-01T00:00:00Z")
    with vm.activate():
        contract = deploy(vm)
        created = json.loads(create(vm, contract)); record = json.loads(contract.get_check(0))
        assert created["challenge_deadline"] == "1767225900"
        assert record["status"] == "challenge_period" and record["bond"] == str(10**16)
        vm.value = 0
        with vm.expect_revert("GEN bond"): contract.create_check("quote", PRIMARY, digest(PRIMARY_BODY), "GSource", "claim", "title")
        vm.value = 1
        with vm.expect_revert("public http"): contract.create_check("quote", "file:///bad", digest(PRIMARY_BODY), "GSource", "claim", "title")
        with vm.expect_revert("SHA-256"): contract.create_check("quote", PRIMARY, "bad", "GSource", "claim", "title")

def test_challenge_access_and_duplicate_guards_execute_in_vm():
    vm = VMContext(); vm.sender = SUBMITTER; vm.warp("2026-01-01T00:00:00Z")
    with vm.activate():
        contract = deploy(vm); create(vm, contract)
        with vm.expect_revert("submitter cannot"): contract.submit_counter_context(0, CONTEXT, digest(CONTEXT_BODY), "context")
        vm.sender = READER
        assert json.loads(contract.submit_counter_context(0, CONTEXT, digest(CONTEXT_BODY), "context"))["count"] == 1
        with vm.expect_revert("duplicate"): contract.submit_counter_context(0, CONTEXT, digest("other"), "other")
        ready(vm)
        with vm.expect_revert("before the challenge deadline"): contract.submit_counter_context(0, "https://evidence.test/late", digest("late"), "late")

def test_accurate_settles_and_cannot_finalize_twice():
    vm = VMContext(); vm.sender = SUBMITTER; vm.warp("2026-01-01T00:00:00Z")
    with vm.activate():
        contract = deploy(vm); create(vm, contract)
        verdict(vm, contract, {"verdict": "accurate", "confidence_band": "high", "reasoning": "matched"})
        record = json.loads(contract.get_check(0))
        assert record["status"] == "verified" and record["paid_to_submitter"] == str(10**16)
        assert contract.bonds.get("0", "") == "0"
        with vm.expect_revert("already has a verdict"): contract.request_verdict(0)

@pytest.mark.parametrize("label,status", [("misleading", "rejected_misleading"), ("not_found", "rejected_not_found")])
def test_negative_verdicts_retain_and_zero_bond(label, status):
    vm = VMContext(); vm.sender = SUBMITTER; vm.warp("2026-01-01T00:00:00Z")
    with vm.activate():
        contract = deploy(vm); create(vm, contract)
        verdict(vm, contract, {"verdict": label, "confidence_band": "low", "reasoning": "failed claim"})
        record = json.loads(contract.get_check(0))
        assert record["status"] == status and record["protocol_retained"] == str(10**16)
        assert record["paid_to_challenger"] == "0" and contract.bonds.get("0", "") == "0"

def test_undetermined_remains_recoverable_then_recovers_once():
    vm = VMContext(); vm.sender = SUBMITTER; vm.warp("2026-01-01T00:00:00Z")
    with vm.activate():
        contract = deploy(vm); create(vm, contract)
        verdict(vm, contract, {"verdict": "invalid enum", "confidence_band": "high", "reasoning": "x" * 2000})
        record = json.loads(contract.get_check(0))
        assert record["status"] == "undetermined" and contract.bonds.get("0", "") == str(10**16)
        assert len(record["reasoning"]) <= 1800
        vm.sender = READER
        with vm.expect_revert("only the quote submitter"): contract.recover_undetermined(0)
        vm.sender = SUBMITTER; contract.recover_undetermined(0)
        recovered = json.loads(contract.get_check(0))
        assert recovered["status"] == "recovered" and recovered["paid_to_submitter"] == str(10**16)
        assert contract.bonds.get("0", "") == "0"
        with vm.expect_revert("only undetermined"): contract.recover_undetermined(0)
