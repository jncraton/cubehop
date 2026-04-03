import re
from playwright.sync_api import Page, expect
import pytest
from pathlib import Path

file_url = Path("index.html").resolve().as_uri()

@pytest.fixture
def root(page: Page):
    page.goto(f"{file_url}#")
    return page

def test_page_title(root):
    expect(root).to_have_title("3D Platformer")

def test_canvas_exists(root):
    expect(root.locator("canvas")).to_be_visible()

def test_ui_elements(root):
    expect(root.locator("#score")).to_be_visible()
    expect(root.locator("#instructions")).to_be_visible()
